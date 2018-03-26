import express from 'express';
import bodyParser from 'body-parser';
import next from 'next';

import { subscribe } from './mailchimp';

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8000;
const ROOT_URL = 'http://localhost:8000';


const app = next({ dev });
const handle = app.getRequestHandler();

// Nextjs's server prepared
app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());

  server.post('/api/v1/public/subscribe', async (req, res) => {
    const { email } = req.body;
    if (!email) {
      res.json({ error: 'Email is required' });
      return;
    }

    try {
      await subscribe({ email });
      res.json({ subscribed: 1 });
      console.log(email);
    } catch (err) {
      res.json({ error: err.message || err.toString() });
    }
  });

  server.get('*', (req, res) => handle(req, res));

  // starting express server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${ROOT_URL}`); // eslint-disable-line no-console
  });
});
