import express from 'express';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';

const port = process.env.PORT || 8000;
const ROOT_URL = dev ? `http://localhost:${port}` : 'https://sitemap-robots.now.sh';

const app = next({ dev });
const handle = app.getRequestHandler();

// Nextjs's server prepared
app.prepare().then(() => {
  const server = express();

  server.get('*', (req, res) => handle(req, res));

  // starting express server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${ROOT_URL}`); // eslint-disable-line no-console
  });
});
