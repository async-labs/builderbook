import mongoose, { Schema } from 'mongoose';
import marked from 'marked';
import he from 'he';
import hljs from 'highlight.js';
import generateSlug from '../utils/slugify';
import Book from './Book';

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
            <i class="material-icons" style="vertical-align: middle; opacity: 0.5; cursor: pointer;">link</i>
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
            <i class="material-icons" style="vertical-align: middle; opacity: 0.5; cursor: pointer;">link</i>
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

const mongoSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  isFree: {
    type: Boolean,
    required: true,
    default: false,
  },
  githubFilePath: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: '',
    required: true,
  },
  htmlContent: {
    type: String,
    default: '',
    required: true,
  },
  excerpt: {
    type: String,
    default: '',
  },
  htmlExcerpt: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  seoTitle: String,
  seoDescription: String,
  sections: [
    {
      text: String,
      level: Number,
      escapedText: String,
    },
  ],
});

class ChapterClass {
  static async getBySlug({ bookSlug, chapterSlug }) {
    const book = await Book.getBySlug({ slug: bookSlug });
    if (!book) {
      throw new Error('Book not found');
    }

    const chapter = await this.findOne({ bookId: book._id, slug: chapterSlug });

    if (!chapter) {
      throw new Error('Chapter not found');
    }

    const chapterObj = chapter.toObject();
    chapterObj.book = book;

    return chapterObj;
  }

  static async syncContent({ book, data }) {
    const {
      title,
      excerpt = '',
      isFree = false,
      seoTitle = '',
      seoDescription = '',
    } = data.attributes;

    const { body, path } = data;

    const chapter = await this.findOne({
      bookId: book.id,
      githubFilePath: path,
    });

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
      const slug = await generateSlug(this, title, { bookId: book._id });

      return this.create({
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
      modifier.slug = await generateSlug(this, title, {
        bookId: chapter.bookId,
      });
    }

    return this.updateOne({ _id: chapter._id }, { $set: modifier });
  }
}

mongoSchema.index({ bookId: 1, slug: 1 }, { unique: true });
mongoSchema.index({ bookId: 1, githubFilePath: 1 }, { unique: true });

mongoSchema.loadClass(ChapterClass);

const Chapter = mongoose.model('Chapter', mongoSchema);

export default Chapter;
