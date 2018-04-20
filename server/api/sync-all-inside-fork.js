import frontmatter from 'front-matter';
import marked from 'marked';
import he from 'he';
import hljs from 'highlight.js';
import mongoose from 'mongoose';

import Book from '../models/Book';
import Chapter from '../models/Chapter';
import Purchase from '../models/Purchase';

import generateSlug from '../utils/slugify';
import { getContent, getCommits } from '../github';
import logger from '../logs';

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const MONGO_URL = dev ? process.env.MONGO_URL_TEST : process.env.MONGO_URL;
mongoose.connect(MONGO_URL);

function markdownToHtml(content) {
  const renderer = new marked.Renderer();

  renderer.link = (href, title, text) => {
    const t = title ? ` title="${title}"` : '';
    return `<a target="_blank" href="${href}" rel="noopener noreferrer"${t}>${text}</a>`;
  };

  renderer.image = href => `<img
    src="${href}"
    style="border: 1px solid #ddd;"
    width="100%"
    alt="Builder Book"
  >`;

  renderer.heading = (text, level) => {
    const escapedText = text
      .trim()
      .toLowerCase()
      .replace(/[^\w]+/g, '-');

    if (level === 2) {
      return `<h${level} class="chapter-section" style="color: #222; font-weight: 400;">
        <a
          name="${escapedText}"
          href="#${escapedText}"
          style="color: #222;"
        > 
          <i
            class="material-icons"
            style="vertical-align: middle; opacity: 0.5; cursor: pointer;"
          >
            link
          </i>
        </a>
        <span class="section-anchor" name="${escapedText}">
          ${text}
        </span>
      </h${level}>`;
    }

    if (level === 4) {
      return `<h${level} style="color: #222;">
        <a
          name="${escapedText}"
          href="#${escapedText}"
          style="color: #222;"
        >
          <i
            class="material-icons"
            style="vertical-align: middle; opacity: 0.5; cursor: pointer;"
            >
              link
            </i>
        </a>
        ${text}
      </h${level}>`;
    }

    return `<h${level} style="color: #222; font-weight: 400;">${text}</h${level}>`;
  };

  marked.setOptions({
    renderer,
    breaks: true,
    highlight(code, lang) {
      if (!lang) {
        return hljs.highlightAuto(code).value;
      }

      return hljs.highlight(lang, code).value;
    },
  });

  return marked(he.decode(content));
}

function getSections(content) {
  const renderer = new marked.Renderer();

  const sections = [];

  renderer.heading = (text, level) => {
    if (level !== 2) {
      return;
    }

    const escapedText = text
      .trim()
      .toLowerCase()
      .replace(/[^\w]+/g, '-');

    sections.push({ text, level, escapedText });
  };

  marked.setOptions({
    renderer,
  });

  marked(he.decode(content));

  return sections;
}

const syncContent = async ({ book, data }) => {
  const {
    title,
    excerpt = '',
    isFree = false,
    seoTitle = '',
    seoDescription = '',
  } = data.attributes;

  const { body, path } = data;

  const chapter = await Chapter.findOne({
    bookId: book._id,
    githubFilePath: path,
  }).lean();

  let order;

  if (path === 'introduction.md') {
    order = 1;
  } else {
    order = parseInt(path.match(/[0-9]+/), 10) + 1;
  }

  const content = body;
  const htmlContent = markdownToHtml(content);
  const htmlExcerpt = markdownToHtml(excerpt);
  const sections = getSections(content);

  if (!chapter) {
    const slug = await generateSlug(Chapter, title, { bookId: book._id });

    return Chapter.create({
      bookId: book._id,
      githubFilePath: path,
      title,
      slug,
      isFree,
      content,
      htmlContent,
      sections,
      excerpt,
      htmlExcerpt,
      order,
      seoTitle,
      seoDescription,
      createdAt: new Date(),
    });
  }

  const modifier = {
    content,
    htmlContent,
    sections,
    excerpt,
    htmlExcerpt,
    isFree,
    order,
    seoTitle,
    seoDescription,
  };

  if (title !== chapter.title) {
    modifier.title = title;
    modifier.slug = await generateSlug(Chapter, title, {
      bookId: chapter.bookId,
    });
  }

  const purchasesWithBookmark = await Purchase.find(
    { bookId: book._id, bookmarks: { $elemMatch: { chapterId: chapter._id } } },
    '_id bookmarks',
  ).lean();

  const orderForBookmark = modifier.order;
  const slugForBookmark = modifier.slug;

  await Promise.all(purchasesWithBookmark.map(async (purchase) => {
    const { chapterId } = purchase.bookmarks[0];

    const modifierForBookmark = {
      'bookmarks.$.chapterOrder': orderForBookmark,
      'bookmarks.$.chapterSlug': slugForBookmark,
    };

    await Purchase.updateOne(
      { _id: purchase._id, 'bookmarks.chapterId': chapterId },
      { $set: modifierForBookmark },
    );
  }));

  return Chapter.updateOne({ _id: chapter._id }, { $set: modifier });
};

const syncAllChapters = async ({ id, githubAccessToken }) => {
  const book = await Book.findById(id, 'userId githubRepo githubLastCommitSha').lean();

  if (!book) {
    throw new Error('Not found');
  }

  const lastCommit = await getCommits({
    accessToken: githubAccessToken,
    repoName: book.githubRepo,
    limit: 1,
  });

  if (!lastCommit || !lastCommit.data || !lastCommit.data[0]) {
    throw new Error('No change in content!');
  }

  const lastCommitSha = lastCommit.data[0].sha;
  /*
  if (lastCommitSha === book.githubLastCommitSha) {
    throw new Error('No change in content!');
  }
  */
  const mainFolder = await getContent({
    accessToken: githubAccessToken,
    repoName: book.githubRepo,
    path: '',
  });

  await Promise.all(mainFolder.data.map(async (f) => {
    if (f.type !== 'file') {
      return;
    }

    if (f.path !== 'introduction.md' && !/chapter-(\d+)\.md/.test(f.path)) {
      // not chapter content, skip
      return;
    }

    const chapter = await getContent({
      accessToken: githubAccessToken,
      repoName: book.githubRepo,
      path: f.path,
    });

    const data = frontmatter(Buffer.from(chapter.data.content, 'base64').toString('utf8'));
    data.path = f.path;

    try {
      await syncContent({ book, data });
      logger.info('Content is synced', { path: f.path });
    } catch (error) {
      logger.error('Content sync has error', { path: f.path, error });
    }
  }));

  return Book.findByIdAndUpdate(book._id, { githubLastCommitSha: lastCommitSha });
};

const syncAllChaptersInsideFork = async ({ bookId, userGithubToken }) => {
  const githubAccessToken = userGithubToken;
  try {
    await syncAllChapters({
      id: bookId,
      githubAccessToken,
    });
  } catch (err) {
    logger.error(err);
    logger.error({ error: err.message || err.toString() });
  }
};

process.on('message', async ({ bookId, userGithubToken }) => {
  // logger.info('Message from parent', { bookId, userGithubToken });
  try {
    await syncAllChaptersInsideFork({ bookId, userGithubToken });
    process.send({ synced: 1 });
  } catch (err) {
    process.send({ error: err });
  }
});
