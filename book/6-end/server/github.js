const qs = require('qs');
const request = require('request');
const GithubAPI = require('@octokit/rest');

const User = require('./models/User');

const AUTHORIZE_URI = 'https://github.com/login/oauth/authorize';
const TOKEN_URI = 'https://github.com/login/oauth/access_token';

function setupGithub({ server }) {
  const dev = process.env.NODE_ENV !== 'production';

  const CLIENT_ID = dev ? process.env.Github_Test_ClientID : process.env.Github_Live_ClientID;
  const API_KEY = dev ? process.env.Github_Test_SecretKey : process.env.Github_Live_SecretKey;

  server.get('/auth/github', (req, res) => {
    if (!req.user || !req.user.isAdmin) {
      res.redirect('/login');
      console.log(res);
      console.log('above is res');
      return;
    }

    res.redirect(
      `${AUTHORIZE_URI}?${qs.stringify({
        scope: 'repo',
        client_id: CLIENT_ID,
      })}`,
    );
  });

  server.get('/auth/github/callback', (req, res) => {
    if (!req.user || !req.user.isAdmin) {
      res.redirect('/login');
      return;
    }

    if (req.query.error) {
      res.redirect(`/admin?error=${req.query.error_description}`);
      return;
    }

    const { code } = req.query;

    request.post(
      {
        url: TOKEN_URI,
        headers: { Accept: 'application/json' },
        form: {
          client_id: CLIENT_ID,
          code,
          client_secret: API_KEY,
        },
      },
      async (err, response, body) => {
        if (err) {
          res.redirect(`/admin?error=${err.message || err.toString()}`);
          return;
        }

        const result = JSON.parse(body);

        if (result.error) {
          res.redirect(`/admin?error=${result.error_description}`);
          return;
        }

        try {
          await User.updateOne(
            { _id: req.user.id },
            { $set: { isGithubConnected: true, githubAccessToken: result.access_token } },
          );
          res.redirect('/admin');
        } catch (err2) {
          res.redirect(`/admin?error=${err2.message || err2.toString()}`);
        }
      },
    );
  });
}

function getAPI({ accessToken }) {
  const github = new GithubAPI({ auth: accessToken, request: { timeout: 10000 } });

  return github;
}

function getRepos({ accessToken }) {
  const github = getAPI({ accessToken });

  return github.repos.list({ per_page: 100 });
}

function getContent({ accessToken, repoName, path }) {
  const github = getAPI({ accessToken });
  const [owner, repo] = repoName.split('/');

  return github.repos.getContents({ owner, repo, path });
}

function getCommits({ accessToken, repoName, limit }) {
  const github = getAPI({ accessToken });
  const [owner, repo] = repoName.split('/');

  return github.repos.listCommits({ owner, repo, per_page: limit });
}

exports.setupGithub = setupGithub;
exports.getRepos = getRepos;
exports.getContent = getContent;
exports.getCommits = getCommits;
