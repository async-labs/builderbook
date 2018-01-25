import express from 'express';

import Book from '../models/Book';
import Chapter from '../models/Chapter';
import logger from '../logs';

const router = express.Router();

router.use((req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
});

router.get('/my-books', async (req, res) => {
  try {
    const { purchasedBookIds = [], freeBookIds = [] } = req.user;

    const { purchasedBooks, freeBooks, otherBooks } = await Book.getPurchasedBooks({
      purchasedBookIds,
      freeBookIds,
    });

    res.json({ purchasedBooks, freeBooks, otherBooks });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

router.post('/buy-book', async (req, res) => {
  const { id, stripeToken } = req.body;

  try {
    await Book.buy({ id, stripeToken, user: req.user });
    res.json({ done: 1 });
  } catch (err) {
    logger.error(err);
    res.json({ error: err.message || err.toString() });
  }
});

router.post('/chapters/add-bookmark', async (req, res) => {
  const { chapterId, hash, text } = req.body;
  try {
    await Chapter.addBookmark({
      chapterId,
      hash,
      text,
      userId: req.user.id,
    });
    res.json({ saved: 1 });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

export default router;
