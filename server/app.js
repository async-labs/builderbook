import express from 'express';
import session from 'express-session';
import compression from 'compression';
import mongoSessionStore from 'connect-mongo';
import next from 'next';
import mongoose from 'mongoose';
import helmet from 'helmet';

import routesWithSlug from './routesWithSlug';
import routesWithCache from './routesWithCache';

import sitemapAndRobots from './sitemapAndRobots';
import auth from './google';
import { setupGithub as github } from './github';
import api from './api';

import logger from './logs';

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8000;
const ROOT_URL = dev ? `http://localhost:${port}` : 'https://builderbook.org';

const MONGO_URL = dev ? process.env.MONGO_URL_TEST : process.env.MONGO_URL;

mongoose.connect(MONGO_URL);

const sessionSecret = process.env.SESSION_SECRET;

const URL_MAP = {
  '/login': '/public/login',
  '/my-books': '/customer/my-books',
};

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(helmet());
  server.use(compression());
  server.use(express.json());

  // potential fix for Error: Can't set headers
  // try with Chrome Dev Tools open/close

  // if (!dev) {
  //   server.use(compression());
  // };

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
    secret: sessionSecret,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 14 * 24 * 60 * 60, // save session 14 days
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000, // expires in 14 days
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
  routesWithCache({ server, app });

  sitemapAndRobots({ server });

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
