const express = require('express');
const session = require('express-session');
const mongoSessionStore = require('connect-mongo');
const next = require('next');
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet');

const setupGoogle = require('./google');
const { setupGithub } = require('./github');
const api = require('./api');

const logger = require('./logger');
// const { insertTemplates } = require('./models/EmailTemplate');
const routesWithSlug = require('./routesWithSlug');
const getRootUrl = require('../lib/api/getRootUrl');
const setupSitemapAndRobots = require('./sitemapAndRobots');
const { stripeCheckoutCallback } = require('./stripe');

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const MONGO_URL = dev ? process.env.MONGO_URL_TEST : process.env.MONGO_URL;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};
mongoose.connect(MONGO_URL, options);

const port = process.env.PORT || 8000;
const ROOT_URL = getRootUrl();

const URL_MAP = {
  '/login': '/public/login',
  '/my-books': '/customer/my-books',
};

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = express();

  server.use(helmet({ contentSecurityPolicy: false }));
  server.use(compression());
  server.use(express.json());

  // give all Nextjs's request to Nextjs server
  server.get('/_next/*', (req, res) => {
    handle(req, res);
  });

  server.get('/static/*', (req, res) => {
    handle(req, res);
  });

  const MongoStore = mongoSessionStore(session);
  const sess = {
    name: 'builderbook.sid',
    secret: 'HD2w.)q*VqRT4/#NK2M/,E^B)}FED5fWU!dKe[wk',
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 14 * 24 * 60 * 60, // expires in 14 days
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000, // expires in 14 days
    },
  };

  if (!dev) {
    server.set('trust proxy', 1); // sets req.hostname, req.ip
    sess.cookie.secure = true; // sets cookie over HTTPS only
    sess.cookie.domain = process.env.COOKIE_DOMAIN; // sets domain for production env
  }

  server.use(session(sess));

  // await insertTemplates();

  setupGoogle({ server, ROOT_URL });
  setupGithub({ server, ROOT_URL });
  api(server);
  routesWithSlug({ server, app });

  stripeCheckoutCallback({ server });

  setupSitemapAndRobots({ server });

  server.get('*', (req, res) => {
    const url = URL_MAP[req.path];
    if (url) {
      app.render(req, res, url);
    } else {
      handle(req, res);
    }
  });

  server.listen(port, (err) => {
    if (err) throw err;
    logger.info(`> Ready on ${ROOT_URL}`);
  });
});
