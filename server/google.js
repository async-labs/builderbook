import util from 'util';
import google from 'googleapis';
import passport from 'passport';

import { Strategy } from 'passport-strategy';

import User from './models/User';

import logger from './logs';

function GoogleStrategy({ clientID, clientSecret, callbackURL }, verify) {
  if (!verify) {
    throw new TypeError('Strategy requires a verify callback');
  }

  if (!clientID) {
    throw new TypeError('Strategy requires a clientID option');
  }

  if (!clientSecret) {
    throw new TypeError('Strategy requires a clientSecret option');
  }

  if (!callbackURL) {
    throw new TypeError('Strategy requires a callbackURL option');
  }

  Strategy.call(this);
  this.name = 'google-oauth2';
  this.verify = verify;

  const { OAuth2 } = google.auth;
  this.oauth2Client = new OAuth2(clientID, clientSecret, callbackURL);
}

util.inherits(GoogleStrategy, Strategy);

GoogleStrategy.prototype.authenticate = function authenticate(req, options) {
  if (req.query && req.query.error) {
    if (req.query.error === 'access_denied') {
      this.fail({ message: req.query.error_description });
      return;
    }

    this.error(new Error(req.query.error_description, req.query.error, req.query.error_uri));
    return;
  }

  if (req.query && req.query.code) {
    this.oauth2Client.getToken(req.query.code, (err, token) => {
      if (err) {
        this.error(err);
        return;
      }

      this.oauth2Client.credentials = token;

      this.loadUserProfile((err2, profile) => {
        if (err2) {
          this.error(err2);
          return;
        }

        const verified = (err3, user, info) => {
          if (err3) {
            this.error(err3);
            return;
          }

          if (!user) {
            this.fail(info);
            return;
          }

          this.success(user, info || {});
        };

        this.verify(token, profile, verified);
      });
    });
  } else {
    const authUrl = this.oauth2Client.generateAuthUrl(Object.assign(
      {},
      {
        access_type: 'offline',
      },
      options,
    ));
    this.redirect(authUrl);
  }
};

GoogleStrategy.prototype.loadUserProfile = function loadUserProfile(done) {
  const plus = google.plus('v1');

  plus.people.get(
    {
      userId: 'me',
      auth: this.oauth2Client,
    },
    (err, resp) => {
      if (err) {
        done(err);
        return;
      }

      const profile = resp;
      profile.provider = 'google';

      done(null, profile);
    },
  );
};

export default function auth({ ROOT_URL, server }) {
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.Google_clientID,
      clientSecret: process.env.Google_clientSecret,
      callbackURL: `${ROOT_URL}/oauth2callback`,
    },
    async (googleToken, profile, done) => {
      let email;
      let avatarUrl;

      if (profile.emails) {
        email = profile.emails[0].value;
      }

      if (profile.image && profile.image.url) {
        avatarUrl = profile.image.url.replace('sz=50', 'sz=128');
      }

      try {
        const user = await User.signInOrSignUp({
          googleId: profile.id,
          email,
          googleToken,
          displayName: profile.displayName,
          avatarUrl,
        });
        done(null, user);
      } catch (err) {
        done(err);
        logger.error(err);
      }
    },
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, User.publicFields(), (err, user) => {
      done(err, user);
    });
  });

  server.use(passport.initialize());
  server.use(passport.session());

  server.get('/auth/google', (req, res, next) => {
    const options = {
      scope: ['profile', 'email'],
      prompt: 'select_account',
    };

    if (req.query && req.query.next && req.query.next.startsWith('/')) {
      req.session.next_url = req.query.next;
    } else {
      req.session.next_url = null;
    }

    passport.authenticate('google-oauth2', options)(req, res, next);
  });

  server.get(
    '/oauth2callback',
    passport.authenticate('google-oauth2', {
      failureRedirect: '/login',
    }),
    (req, res) => {
      if (req.user && req.user.isAdmin) {
        res.redirect('/admin');
      } else if (req.session.next_url) {
        res.redirect(req.session.next_url);
      } else {
        res.redirect('/my-books');
      }
    },
  );

  server.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  });
}
