// This syntax is needed now, but in the future it'll be like the rest of the ES6 standard syntax
//  import express from 'express';
const express = require('express');
const next = require('next');
const mongoose = require('mongoose');
const session = require('express-session');
const User = require('./models/User');

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const MONGO_URL = process.env.MONGO_URL_TEST;

// Done to suppress depreciation warnings from mongoose
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

mongoose.connect(MONGO_URL, options);

const port = process.env.PORT || 8000; // Note the change of port
const ROOT_URL = `http://localhost:${port}`;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const sess = {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
      domain: 'localhost',
    },
  };

  server.use(session(sess));

  // the below statement when uncommented will send a response without our page
  //   server.get('/', (req, res) => {
  //     res.send('My asdf server');
  //   });

  server.get('/', async (req, res) => {
    // const user = { email: 'team@builderbook.org' };
    const user = await User.findOne({ slug: 'team-builder-book' });
    app.render(req, res, '/', { user });
  });

  // This must be below the above user get statment
  server.get('*', (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${ROOT_URL}`);
  });
});
