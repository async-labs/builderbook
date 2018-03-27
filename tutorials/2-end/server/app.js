import express from 'express';
import next from 'next';
import bodyParser from 'body-parser';
import sendEmail from './aws';

const dev = process.env.NODE_ENV !== 'production';

const port = process.env.PORT || 8000;
const ROOT_URL = dev ? `http://localhost:${port}` : 'https://builderbook.org';

const app = next({ dev });
const handle = app.getRequestHandler();

// Nextjs's server prepared
app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());

  server.post('/api/v1/public/send-email', async (req, res) => {
    const { email } = req.body;
    if (!email) {
      res.json({ error: 'Email is required' });
      return;
    }

    const template = {
      subject: 'Welcome to builderbook.org',
      message: `Hooowdy Ho,
        <p>
          Thank you for signing up on our website!
        </p>
        <p>
          Have a good day.
        </p>
        Mr. Hanky
      `,
    };

    try {
      await sendEmail({
        from: 'Mr.Hanky from Builder Book <team@builderbook.org>',
        to: [email],
        subject: template.subject,
        body: template.message,
      });
      res.json({ sent: 1 });
      console.log(email); // eslint-disable-line no-console
    } catch (err) {
      console.log('Email sending error:', err); // eslint-disable-line no-console
    }
  });

  server.get('*', (req, res) => handle(req, res));

  // starting express server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${ROOT_URL}`); // eslint-disable-line no-console
  });
});
