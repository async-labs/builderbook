import express from 'express';
import bodyParser from 'body-parser';
import next from 'next';
import api from './api';

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';

const port = process.env.PORT || 8000;
const ROOT_URL = dev ? `http://localhost:${port}` : 'https://builderbook.org';

const app = next({ dev });
const handle = app.getRequestHandler();

// Nextjs's server prepared
app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());

  api(server);

  server.get('*', (req, res) => handle(req, res));

  // starting express server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${ROOT_URL}`); // eslint-disable-line no-console
  });
});
