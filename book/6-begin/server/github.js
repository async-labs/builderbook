const { Octokit } = require('@octokit/rest');
const fetch = require('node-fetch');
const { oauthAuthorizationUrl } = require('@octokit/oauth-authorization-url');
const _ = require('lodash');

const User = require('./models/User');

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const CLIENT_ID = dev ? process.env.GITHUB_TEST_CLIENTID : process.env.GITHUB_LIVE_CLIENTID;
const API_KEY = dev ? process.env.GITHUB_TEST_SECRETKEY : process.env.GITHUB_LIVE_SECRETKEY;

function setupGithub({ server, ROOT_URL }) {
  const verify = async ({ user, accessToken, profile }) => {
    const modifier = {
      githubId: profile.id,
      githubAccessToken: accessToken,
      githubUsername: profile.login,
      isGithubConnected: true,
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
    if (!req.user || !req.user.isAdmin) {
      res.redirect(`${ROOT_URL}/login`);
      return;
    }

    const { url, state } = oauthAuthorizationUrl({
      clientId: CLIENT_ID,
      redirectUrl: `${ROOT_URL}/auth/github/callback`,
      scopes: ['repo', 'user:email'],
      log: { warn: (message) => console.log(message) },
    });

    req.session.githubAuthState = state;
    if (req.query && req.query.redirectUrl && req.query.redirectUrl.startsWith('/')) {
      req.session.next_url = req.query.redirectUrl;
    } else {
      req.session.next_url = null;
    }

    res.redirect(url);
  });

  server.get('/auth/github/callback', async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
      res.redirect(`${ROOT_URL}/login`);
      return;
    }

    const { next_url, githubAuthState } = req.session;

    let redirectUrl = ROOT_URL;

    if (next_url && next_url.startsWith('/')) {
      req.session.next_url = null;
      redirectUrl = `${ROOT_URL}${next_url}`;
    }

    if (githubAuthState !== req.query.state) {
      res.redirect(`${redirectUrl}/admin?error=Wrong request`);
    }

    try {
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-type': 'application/json;', Accept: 'application/json' },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: API_KEY,
          code: req.query.code,
          state: req.query.state,
          redirect_uri: `${ROOT_URL}/auth/github/callback`,
        }),
      });

      const resData = await response.json();

      const github = new Octokit({
        auth: resData.access_token,
        request: { timeout: 10000 },
      });

      const profile = await github.users.getAuthenticated();

      await verify({
        user: req.user,
        accessToken: resData.access_token,
        profile: profile.data,
      });
    } catch (error) {
      console.error(error.toString());

      res.redirect(`${redirectUrl}/admin?error=${error.toString()}`);
    }

    res.redirect(`${redirectUrl}/admin`);
  });
}

function getAPI({ user, previews = [], request }) {
  const github = new Octokit({
    auth: user.githubAccessToken,
    request: { timeout: 10000 },
    previews,
    log: {
      info(msg, info) {
        console.log(`Github API log: ${msg}`, {
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

  return github.repos.listForAuthenticatedUser({
    visibility: 'private',
    per_page: 100,
    affiliation: 'owner',
  });
}

function getRepoDetail({ user, repoName, request, path }) {
  const github = getAPI({ user, request });
  const [owner, repo] = repoName.split('/');

  return github.repos.getContent({ owner, repo, path });
}

function getCommits({ user, repoName, request }) {
  const github = getAPI({ user, request });
  const [owner, repo] = repoName.split('/');

  return github.repos.listCommits({ owner, repo });
}

exports.setupGithub = setupGithub;
exports.getRepos = getRepos;
exports.getRepoDetail = getRepoDetail;
exports.getCommits = getCommits;
