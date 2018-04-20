import frontmatter from 'front-matter';
import marked from 'marked';
import he from 'he';
import hljs from 'highlight.js';
import mongoose from 'mongoose';

import Book from '../models/Book';
import Chapter from '../models/Chapter';
import Purchase from '../models/Purchase';

import generateSlug from '../utils/slugify';
import { getContent } from '../github';
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

const syncOneChapter = async ({ id, githubAccessToken, chapterId }) => {
  const book = await Book.findById(id, 'userId githubRepo').lean();

  const chapter = await Chapter.findById(chapterId, 'githubFilePath').lean();

  if (!book) {
    throw new Error('Not found');
  }

  const chapterContent = await getContent({
    accessToken: githubAccessToken,
    repoName: book.githubRepo,
    path: chapter.githubFilePath,
  });

  const data = frontmatter(Buffer.from(chapterContent.data.content, 'base64').toString('utf8'));
  data.path = chapter.githubFilePath;

  try {
    await syncContent({ book, data });
    logger.info('Content is synced', { path: chapter.githubFilePath });
  } catch (error) {
    logger.info('Content sync has error', { path: chapter.githubFilePath, error });
  }
};

const syncOneChapterInsideFork = async ({ bookId, chapterId, userGithubToken }) => {
  const githubAccessToken = userGithubToken;
  try {
    await syncOneChapter({
      id: bookId,
      githubAccessToken,
      chapterId,
    });
  } catch (err) {
    logger.info(err);
  }
};

process.on('message', async ({ bookId, chapterId, userGithubToken }) => {
  // logger.info('Message from parent', { bookId, chapterId, userGithubToken });

  try {
    await syncOneChapterInsideFork({ bookId, chapterId, userGithubToken });
    process.send({ synced: 1 });
  } catch (err) {
    process.send({ error: err });
  }
});
