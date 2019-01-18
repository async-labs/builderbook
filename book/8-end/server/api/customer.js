const express = require('express');
const Book = require('../models/Book');
const logger = require('../logs');

const router = express.Router();

router.use((req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
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

router.get('/my-books', async (req, res) => {
  try {
    const { purchasedBookIds = [] } = req.user;

    const { purchasedBooks } = await Book.getPurchasedBooks({ purchasedBookIds });

    res.json({ purchasedBooks });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

module.exports = router;
