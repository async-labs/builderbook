import express from 'express';

import Book from '../models/Book';
import { getContent, getRepos } from '../github';
import User from '../models/User';
import logger from '../logs';

const router = express.Router();

router.use((req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
});

router.post('/sync-tos', async (req, res) => {
  if (!req.user.isGithubConnected) {
    res.json({ error: 'Github is not connected' });
    return;
  }

  const user = await User.findById(req.user.id, 'githubAccessToken');
  if (!user || !user.githubAccessToken) {
    res.json({ error: 'Github is not connected' });
    return;
  }

  try {
    const { data } = await getContent({
      accessToken: user.githubAccessToken,
      repoName: 'builderbook/builderbook-private',
      path: 'tos.md',
    });

    const content = Buffer.from(data.content, 'base64').toString('utf8');

    const firstAdminUser = await User.findOne({ isAdmin: true }, 'id').sort({ createdAt: 1 });
    await firstAdminUser.update({ tos: content });
    res.json({ done: 1 });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

router.get('/books', async (req, res) => {
  try {
    const books = await Book.list();
    res.json(books);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

router.post('/books/add', async (req, res) => {
  try {
    await Book.add(req.body);
    res.json({ done: 1 });
  } catch (err) {
    logger.error(err);
    res.json({ error: err.message || err.toString() });
  }
});

router.post('/books/edit', async (req, res) => {
  try {
    await Book.edit(req.body);
    res.json({ done: 1 });
  } catch (err) {
    logger.error(err);
    res.json({ error: err.message || err.toString() });
  }
});

router.get('/books/detail/:slug', async (req, res) => {
  try {
    const book = await Book.getBySlug({ slug: req.params.slug });
    res.json(book);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

router.post('/books/sync-content', async (req, res) => {
  const { bookId } = req.body;

  const user = await User.findById(req.user._id, 'isGithubConnected githubAccessToken');

  if (!user.isGithubConnected || !user.githubAccessToken) {
    res.json({ error: 'Github not connected' });
    return;
  }

  try {
    await Book.syncContent({ id: bookId, githubAccessToken: user.githubAccessToken });
    res.json({ done: 1 });
  } catch (err) {
    logger.error(err);
    res.json({ error: err.message || err.toString() });
  }
});

router.get('/github/repos', async (req, res) => {
  const user = await User.findById(req.user._id, 'isGithubConnected githubAccessToken');
  if (!user.isGithubConnected || !user.githubAccessToken) {
    res.json({ error: 'Github not connected' });
    return;
  }

  try {
    const response = await getRepos({ accessToken: user.githubAccessToken });
    res.json({ repos: response.data });
  } catch (err) {
    logger.error(err);
    res.json({ error: err.message || err.toString() });
  }
});

router.get('/github/repo-files', async (req, res) => {
  const user = await User.findById(req.user._id, 'isGithubConnected githubAccessToken');
  if (!user.isGithubConnected || !user.githubAccessToken) {
    res.json({ error: 'Github not connected' });
    return;
  }

  try {
    const mainFolder = await getContent({
      accessToken: user.githubAccessToken,
      repoName: req.query.repo,
      path: '',
    });

    const files = mainFolder.data.filter(f => f.type === 'file' && f.path.endsWith('.md'));
    res.json({ files });
  } catch (err) {
    logger.error(err);
    res.json({ error: err.message || err.toString() });
  }
});

router.post('/users/search', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    res.json({ error: 'Empty query' });
    return;
  }

  try {
    const users = await User.search(query);
    res.json({ users });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

router.post('/users/give-free-book', async (req, res) => {
  const { userId, bookId } = req.body;

  if (!userId || !bookId) {
    res.json({ error: 'Wrong data' });
    return;
  }

  try {
    await Book.giveFree({ id: bookId, userId });
    res.json({ done: 1 });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

export default router;
