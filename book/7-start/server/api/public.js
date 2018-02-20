import express from 'express';

import Book from '../models/Book';
import Chapter from '../models/Chapter';
// import User from '../models/User';

const router = express.Router();

router.get('/books', async (req, res) => {
  try {
    const books = await Book.list();
    res.json(books);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

router.get('/books/:slug', async (req, res) => {
  try {
    const book = await Book.getBySlug({ slug: req.params.slug, userId: req.user && req.user.id });
    res.json(book);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

router.get('/get-chapter-detail', async (req, res) => {
  try {
    const { bookSlug, chapterSlug } = req.query;
    const book = await Chapter.getBySlug({
      bookSlug,
      chapterSlug,
      userId: req.user && req.user.id,
    });
    res.json(book);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

export default router;
