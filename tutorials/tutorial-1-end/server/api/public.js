import express from 'express';
import { subscribe } from '../mailchimp';

const router = express.Router();

router.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.json({ error: 'Email is required' });
    return;
  }

  try {
    await subscribe({ email });
    res.json({ done: 1 });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

export default router;
