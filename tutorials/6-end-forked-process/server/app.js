import express from 'express';
import { fork } from 'child_process';
import next from 'next';
import longComputation from './longComputation';

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8000;
const ROOT_URL = dev ? `http://localhost:${port}` : 'https://forked-process.builderbook.org';

const app = next({ dev });
const handle = app.getRequestHandler();

// Nextjs's server prepared
app.prepare().then(() => {
  const server = express();

  server.get('/api/v1/public/main-process', async (req, res) => {
    try {
      const limit = 2e9;
      const sum = await longComputation(limit);
      res.json(sum);
      console.log('sent array to client');
    } catch (err) {
      res.json({ error: err.message || err.toString() });
    }
  });

  server.get('/api/v1/public/forked-process', async (req, res) => {
    try {
      const forked = fork(dev ? './server/forked-longComputation.js' : './compiled/server/forked-longComputation.js');
      const limit = 2e9;
      forked.send(limit);
      forked.on('message', (sum) => {
        res.json(sum);
        console.log('sent array to client');
        forked.kill();
      });
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
