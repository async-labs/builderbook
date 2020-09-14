const mongoose = require('mongoose');
const frontmatter = require('front-matter');

const { getCommits, getContent } = require('../github');
const { subscribeOrUpdate } = require('../mailchimp');
const generateSlug = require('../utils/slugify');

const User = require('./User');
const Purchase = require('./Purchase');

// const sendEmail = require('../aws');
// const getEmailTemplate = require('./EmailTemplate');

const logger = require('../logs');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },

  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },

  githubRepo: {
    type: String,
    required: true,
  },
  githubLastCommitSha: String,

  createdAt: {
    type: Date,
    required: true,
  },
  // price in dollars
  price: {
    type: Number,
    required: true,
  },

  textNearButton: String,

  supportURL: String,
});

class BookClass {
  static async list({ offset = 0, limit = 10 } = {}) {
    const books = await this.find({})
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();
    return { books };
  }

  static async getPurchasedBooks({ purchasedBookIds, freeBookIds }) {
    const allBooks = await this.find().sort({ createdAt: -1 });

    const purchasedBooks = [];
    const freeBooks = [];
    const otherBooks = [];

    for (let i = 0; i < allBooks.length; i += 1) {
      const b = allBooks[i];

      if (purchasedBookIds.includes(b.id)) {
        purchasedBooks.push(b);
      } else if (freeBookIds.includes(b.id)) {
        freeBooks.push(b);
      } else {
        otherBooks.push(b);
      }
    }

    return { purchasedBooks, freeBooks, otherBooks };
  }

  static async getBySlug({ slug }) {
    const book = await this.findOne({ slug }).lean();
    if (!book) {
      throw new Error('Book not found');
    }

    // eslint-disable-next-line no-use-before-define
    book.chapters = await Chapter.find({ bookId: book._id }, 'title slug')
      .lean()
      .sort({ order: 1 });

    return book;
  }

  static async add({ name, userId, price, textNearButton = '', githubRepo, supportURL = '' }) {
    const slug = await generateSlug(this, name);

    return this.create({
      name,
      userId,
      slug,
      price,
      textNearButton,
      githubRepo,
      supportURL,
      createdAt: new Date(),
    });
  }

  static async edit({ id, name, price, textNearButton = '', githubRepo, supportURL = '' }) {
    const book = await this.findById(id, 'slug name userId').lean();

    if (!book) {
      throw new Error('Not found');
    }

    const modifier = {
      price,
      textNearButton,
      supportURL,
      githubRepo,
    };

    if (name !== book.name) {
      modifier.name = name;
      modifier.slug = await generateSlug(this, name);
    }

    return this.updateOne({ _id: id }, { $set: modifier });
  }

  static async syncOneChapter({ id, githubAccessToken, chapterId }) {
    const book = await this.findById(id, 'userId githubRepo').lean();
    // eslint-disable-next-line no-use-before-define
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
      // eslint-disable-next-line no-use-before-define
      await Chapter.syncContent({ book, data });
      logger.info('Content is synced', { path: chapter.githubFilePath });
    } catch (error) {
      logger.error('Content sync has error', { path: chapter.githubFilePath, error });
    }
  }

  static async syncAllChapters({ id, githubAccessToken }) {
    const book = await this.findById(id, 'userId githubRepo githubLastCommitSha').lean();

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

    await Promise.all(
      mainFolder.data.map(async (f) => {
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
          // eslint-disable-next-line no-use-before-define
          await Chapter.syncContent({ book, data });
          logger.info('Content is synced', { path: f.path });
        } catch (error) {
          logger.error('Content sync has error', { path: f.path, error });
        }
      }),
    );

    return this.findByIdAndUpdate(book._id, { githubLastCommitSha: lastCommitSha });
  }

  static async buy({ book, user, stripeCharge }) {
    if (!book) {
      throw new Error('Book not found');
    }

    if (!user) {
      throw new Error('User required');
    }

    const isPurchased =
      (await Purchase.find({ userId: user._id, bookId: book._id }).countDocuments()) > 0;
    if (isPurchased) {
      throw new Error('Already bought this book');
    }

    User.findByIdAndUpdate(user._id, { $addToSet: { purchasedBookIds: book._id } }).exec();

    try {
      const purchasedBookIds = await Purchase.find({ userId: user._id })
        .select('bookId')
        .lean();
      const purchasedBooks = await this.find({
        _id: { $in: [...purchasedBookIds.map((p) => p.bookId), book._id] },
      })
        .select('slug')
        .lean();

      await subscribeOrUpdate({
        email: user.email,
        listName: 'purchased',
        mergeFields: {
          BOOK: purchasedBooks.map((r) => r.slug).join(','),
        },
      });
    } catch (error) {
      logger.error('Mailchimp error:', error);
    }

    return Purchase.create({
      userId: user._id,
      bookId: book._id,
      amount: book.price * 100,
      createdAt: new Date(),
      stripeCharge,
    });
  }

  static async giveFree({ id, userId }) {
    const book = await this.findById(id, 'id').lean();
    if (!book) {
      throw new Error('Book not found');
    }

    if (!userId) {
      throw new Error('User ID required');
    }

    const isPurchased =
      (await Purchase.find({ userId, bookId: id })
        .lean()
        .countDocuments()) > 0;
    if (isPurchased) {
      throw new Error('Already bought this book');
    }

    User.findByIdAndUpdate(userId, { $addToSet: { freeBookIds: book._id } }).exec();

    return Purchase.create({
      userId,
      bookId: book._id,
      amount: 0,
      createdAt: new Date(),
      isFree: true,
    });
  }
}

mongoSchema.loadClass(BookClass);

const Book = mongoose.model('Book', mongoSchema);

module.exports = Book;

const Chapter = require('./Chapter');
