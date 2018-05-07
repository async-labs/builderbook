const express = require('express');
const _ = require('lodash');

const Book = require('../models/Book');
const Chapter = require('../models/Chapter');
const Purchase = require('../models/Purchase');
const logger = require('../logs');

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

router.get('/my-bookmarks', async (req, res) => {
  try {
    const { user } = req;
    const allPurchases = await Purchase.find({ userId: user._id }, 'bookId bookmarks').lean();
    // logger.info(allPurchases);

    const bookmarks = await Promise.all(allPurchases.map(async (purchase) => {
      if (!purchase.bookmarks || purchase.bookmarks.length < 1) {
        return null;
      }

      const book = await Book.findById(purchase.bookId, 'name slug').lean();
      // logger.info(book.name);
      return {
        bookName: book.name,
        bookSlug: book.slug,
        bookmarksArray: _.sortBy(purchase.bookmarks, 'chapterOrder'),
      };
    }));

    res.json({ bookmarks: bookmarks.filter(b => !!b) });
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
  const {
    chapterId, chapterSlug, chapterOrder, hash, text,
  } = req.body;
  // logger.info(chapterSlug);
  try {
    await Chapter.addBookmark({
      chapterId,
      chapterSlug,
      chapterOrder,
      hash,
      text,
      userId: req.user.id,
    });
    res.json({ saved: 1 });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

module.exports = router;
