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
// 1. /my-books
// 2. /buy-book
// 3. /chapters/add-bookmark

export default router;
