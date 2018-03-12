import express from 'express';
import session from 'express-session';
import compression from 'compression';
import mongoSessionStore from 'connect-mongo';
import bodyParser from 'body-parser';
import next from 'next';
import mongoose from 'mongoose';
import helmet from 'helmet';
import getRootUrl from '../lib/api/getRootUrl';
import sitemapAndRobots from './sitemapAndRobots';
import auth from './google';
import { setupGithub as github } from './github';
import api from './api';

import logger from './logs';
import routesWithSlug from './routesWithSlug';

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const MONGO_URL = process.env.MONGO_URL_TEST;

mongoose.connect(MONGO_URL);

const port = process.env.PORT || 8000;
const ROOT_URL = getRootUrl();

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
  server.use(bodyParser.json());

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
  }

  server.use(session(sess));

  auth({ server, ROOT_URL });
  github({ server });
  api(server);
  routesWithSlug({ server, app });
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
