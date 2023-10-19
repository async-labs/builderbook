const express = require('express');
const next = require('next');

const mongoose = require('mongoose');

const session = require('express-session');
const mongoSessionStore = require('connect-mongo');

const User = require('./models/User');

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const MONGO_URL = process.env.MONGO_URL_TEST;

mongoose.connect(MONGO_URL);

// mongoose
//   .connect(MONGO_URL, options)
//   .then(() => console.log('Connected')) // eslint-disable-line no-console
//   .catch((err) => console.log('Caught', err.stack)); // eslint-disable-line no-console

const port = process.env.PORT || 8000;
const ROOT_URL = `http://localhost:${port}`;

const app = next({ dev });
const handle = app.getRequestHandler();

// Nextjs's server prepared
app.prepare().then(() => {
  const server = express();

  const sessionOptions = {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    store: mongoSessionStore.create({
      mongoUrl: MONGO_URL,
      ttl: 14 * 24 * 60 * 60, // save session 14 days
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000, // expires in 14 days
      domain: 'localhost',
    },
  };

  const sessionMiddleware = session(sessionOptions);
  server.use(sessionMiddleware);

  // server.get('/', (req, res) => {
  //   const user = { email: 'team@builderbook.org' };
  //   app.render(req, res, '/', { user });
  // });

  // this is testing code, remove later
  server.get('/', async (req, res) => {
    req.session.foo = 'bar';

    const user = await User.findOne({ slug: 'team-builder-book' });

    app.render(req, res, '/', { user });
  });

  server.get('*', (req, res) => handle(req, res));

  // starting express server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${ROOT_URL}`);
  });
});
