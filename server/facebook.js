const passport = require('passport');
const strategy = require("passport-facebook");
const User = require('./models/User');
const FacebookStrategy = strategy.Strategy;

function authFace({ ROOT_URL, server }) {
  const verify = async (accessToken, refreshToken, profile, verified) => {
    const { first_name, last_name } = profile._json;
    let email;
    let avatarUrl;
    if (profile.emails) {
      email = profile.emails[0].value;
    }
    
    if (profile.photos && profile.photos.length > 0) {
      avatarUrl = profile.photos[0].value;
    }

    try {
      const user = await User.signInOrSignUp({
        email,
        firstName: first_name,
        lastName: last_name,
        googleId: profile.id,
        googleToken: { accessToken, refreshToken },
        displayName: profile.displayName,
        avatarUrl,
      });
      verified(null, user);
    } catch (err) {
      verified(err);
        console.log(err); // eslint-disable-line
    }
  };
  passport.use(
    new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_CLIENT_ID,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          callbackURL: `${ROOT_URL}/auth/facebook/callback`,
          profileFields: ["id", "name","emails","displayName","profileUrl",'picture.type(large)']
        },
      verify,
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, User.publicFields(), (err, user) => {
      done(err, user);
      // eslint-disable-next-line no-console
      console.log('deserializeUser', id);
    });
  });

  server.use(passport.initialize());
  server.use(passport.session());

  server.get('/auth/facebook', (req, res, next) => {
    const options = {
      scope: ['email'],
    };

    if (req.query && req.query.redirectUrl && req.query.redirectUrl.startsWith('/')) {
      req.session.finalUrl = req.query.redirectUrl;
    } else {
      req.session.finalUrl = null;
    }

    passport.authenticate('facebook', options)(req, res, next)
  }
  );

  server.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/login',
    }),
    (req, res) => {
      if (req.user && req.user.isAdmin) {
        res.redirect('/admin');
      } else if (req.session.finalUrl) {
        res.redirect(req.session.finalUrl);
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

module.exports = authFace;
