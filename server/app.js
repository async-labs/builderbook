import express from 'express';
import session from 'express-session';
import mongoSessionStore from 'connect-mongo';
import bodyParser from 'body-parser';
import next from 'next';
import mongoose from 'mongoose';

import auth from './google';
import { setupGithub as github } from './github';
import api from './api';

import logger from './logs';
import routesWithSlug from './routesWithSlug';

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';

const MONGO_URL = dev ? process.env.MONGO_URL_TEST : process.env.MONGO_URL;

mongoose.connect(MONGO_URL);

const port = process.env.PORT || 8000;
const ROOT_URL = process.env.ROOT_URL || `http://localhost:${port}`;

const URL_MAP = {
  '/login': '/public/login',
  '/my-books': '/customer/my-books',
  '/terms': '/public/terms',
};

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // give all Nextjs's request to Nextjs before anything else
  // no middleware (auth, session etc...) needed for it
  server.get('/_next/*', (req, res) => {
    handle(req, res);
  });

  server.get('/static/*', (req, res) => {
    handle(req, res);
  });

  server.use(bodyParser.json());

  const MongoStore = mongoSessionStore(session);
  const sess = {
    name: 'builderbook.sid',
    secret: 'Hw.)q*VqRT4/#:M/,E^B)}AS_-DKdKe[wk',
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 14 * 24 * 60 * 60, // save session 14 days
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
    },
  };

  if (!dev) {
    server.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
  }

  server.use(session(sess));

  auth({ server, ROOT_URL });
  github({ server });
  api(server);
  routesWithSlug({ server, app });

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
