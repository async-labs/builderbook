const { Octokit } = require('@octokit/rest');
const fetch = require('node-fetch');
const { oauthLoginUrl } = require('@octokit/oauth-login-url');
const _ = require('lodash');

const { decrypt, encrypt } = require('./encrypt');
const logger = require('./logger');
const User = require('./models/User');

const dev = process.env.NODE_ENV !== 'production';
const CLIENT_ID = dev ? process.env.Github_Test_ClientID : process.env.Github_Live_ClientID;
const API_KEY = dev ? process.env.Github_Test_SecretKey : process.env.Github_Live_SecretKey;

function getAPI({ user, previews = [], request }) {
  const github = new Octokit({
    auth: decrypt(user.githubAccessToken),
    previews,
    request: { timeout: 10000 },
    log: {
      info(msg, info) {
        logger.info(`Github API log: ${msg}`, {
          ..._.omit(info, 'headers', 'request', 'body'),
          user: _.pick(user, '_id', 'githubUsername', 'githubId'),
          ..._.pick(request, 'ip', 'hostname'),
        });
      },
    },
  });

  return github;
}

function getRepos({ user, request }) {
  const github = getAPI({ user, request });

  return github.repos.list({ per_page: 100 });
}

function getRepoDetail({ user, repoName, request }) {
  const github = getAPI({ user, request });
  const [owner, repo] = repoName.split('/');

  return github.repos.get({ owner, repo });
}

function getCommits({ user, repoName, branch, limit, request }) {
  const github = getAPI({ user, request });
  const [owner, repo] = repoName.split('/');

  return github.repos.listCommits({ owner, repo, sha: branch, per_page: limit });
}

function setupGithub({ server, ROOT_URL }) {
  const verify = async ({ user, accessToken, profile }) => {
    const modifier = {
      githubId: profile.id,
      githubAccessToken: encrypt(accessToken),
      githubUsername: profile.login,
    };

    if (!user.displayName) {
      modifier.displayName = profile.name || profile.login;
    }

    if (!user.avatarUrl && profile.avatar_url) {
      modifier.avatarUrl = profile.avatar_url;
    }

    await User.updateOne({ _id: user._id }, modifier);
  };

  server.get('/auth/github', (req, res) => {
    if (!req.user) {
      res.redirect(ROOT_URL);
    }

    const { url, state } = oauthLoginUrl({
      clientId: decrypt(CLIENT_ID),
      redirectUrl: `${ROOT_URL}/auth/github/callback`,
      scopes: ['repo', 'user:email'],
      log: { warn: (message) => logger.warn(message) },
    });

    req.session.githubAuthState = state;
    if (req.query && req.query.next && req.query.next.startsWith('/')) {
      req.session.next_url = req.query.next;
    } else {
      req.session.next_url = null;
    }

    res.redirect(url);
  });

  server.get('/auth/github/callback', async (req, res) => {
    if (!req.user) {
      res.redirect(ROOT_URL);
    }

    const { next_url, githubAuthState } = req.session;

    let redirectUrl = ROOT_URL;

    if (next_url && next_url.startsWith('/')) {
      req.session.next_url = null;
      redirectUrl = `${ROOT_URL}${next_url}`;
    }

    if (githubAuthState !== req.query.state) {
      res.redirect(`${redirectUrl}?error=Wrong request`);
    }

    try {
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-type': 'application/json;', Accept: 'application/json' },
        body: JSON.stringify({
          client_id: decrypt(CLIENT_ID),
          client_secret: decrypt(API_KEY),
          code: req.query.code,
          state: req.query.state,
          redirect_uri: `${ROOT_URL}/auth/github/callback`,
        }),
      });

      const resData = await response.json();

      const githubWithAccessToken = new Octokit({
        auth: resData.access_token,
        request: { timeout: 10000 },
      });

      const profile = await githubWithAccessToken.users.getAuthenticated();

      await verify({
        user: req.user,
        accessToken: resData.access_token,
        profile: profile.data,
      });
    } catch (error) {
      logger.error(error.toString());

      res.redirect(`${redirectUrl}?error=${error.toString()}`);
    }

    res.redirect(redirectUrl);
  });
}

exports.getRepos = getRepos;
exports.getRepoDetail = getRepoDetail;
exports.getCommits = getCommits;
exports.setupGithub = setupGithub;
