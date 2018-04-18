import express from 'express';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8000;
const ROOT_URL = dev ? `http://localhost:${port}` : 'https://layout-hoc.builderbook.org';

const app = next({ dev });
const handle = app.getRequestHandler();

// Nextjs's server prepared
app.prepare().then(() => {
  const server = express();

  // server.get('/', async (req, res) => {
  //   try {
  //     const user = { email: 'team@builderbook.org' };
  //     app.render(req, res, '/', { user });
  //   } catch (err) {
  //     res.json({ error: err.message || err.toString() });
  //   }
  // });

  server.get('/api/v1/public/get-user', async (req, res) => {
    try {
      const user = { email: 'email@gmail.com' };
      res.json(user);
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
