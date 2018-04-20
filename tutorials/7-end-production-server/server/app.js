import express from 'express';
import next from 'next';
import compression from 'compression';
import helmet from 'helmet';
import getDataOnServer from './data';

import routesWithNoCache from './routesWithNoCache';
import routesWithCache from './routesWithCache';

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8000;
const ROOT_URL = dev ? `http://localhost:${port}` : 'https://layout-hoc.builderbook.org';
// const MONGO_URL = dev ? process.env.MONGO_URL_TEST : process.env.MONGO_URL;

const app = next({ dev });
const handle = app.getRequestHandler();

// Nextjs's server prepared
app.prepare().then(() => {
  const server = express();

  server.use(helmet());

  // server.use(helmet({
  //   hidePoweredBy: false,
  // }));

  server.use(compression());

  server.use(express.json());

  server.get('/api/v1/public/get-data', async (req, res) => {
    try {
      const array = await getDataOnServer();
      res.json({ array });
    } catch (err) {
      res.json({ error: err.message || err.toString() });
    }
  });

  routesWithNoCache({ server, app });
  routesWithCache({ server, app });

  server.get('*', (req, res) => handle(req, res));

  // starting express server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${ROOT_URL}`); // eslint-disable-line no-console
  });
});

// Mention:
// static folder and CDN (logo, styles)
// proxy, cookie (future post)
// sitemap, robots (Kelly's post)
// PM2, Load balancer, restart (snapshots, logs)
// try/catch and async/await
// separate Next and API servers (different posts or apps) (future post)

