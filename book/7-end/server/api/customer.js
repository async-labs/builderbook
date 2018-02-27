import express from 'express';

const router = express.Router();

router.use((req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
});

// List of API:
// 1. /buy-book
// 2. /my-books

export default router;
