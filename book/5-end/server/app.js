import express from 'express';
import session from 'express-session';
import mongoSessionStore from 'connect-mongo';
import next from 'next';
import mongoose from 'mongoose';

import auth from './google';
import api from './api';

import logger from './logs';

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const MONGO_URL = process.env.MONGO_URL_TEST;

mongoose.connect(MONGO_URL, { useNewUrlParser: true });

const port = process.env.PORT || 8000;
const ROOT_URL = process.env.ROOT_URL || `http://localhost:${port}`;

const URL_MAP = {
  '/login': '/public/login',
};

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

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

  server.use(session(sess));

  auth({ server, ROOT_URL });
  api(server);

  server.get('/books/:bookSlug/:chapterSlug', (req, res) => {
    const { bookSlug, chapterSlug } = req.params;
    app.render(req, res, '/public/read-chapter', { bookSlug, chapterSlug });
  });

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

