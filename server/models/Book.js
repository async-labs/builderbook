import mongoose, { Schema } from 'mongoose';
import _ from 'lodash';
import frontmatter from 'front-matter';

import { getCommits, getContent } from '../github';
import { charge as stripeCharge } from '../stripe';
import sendEmail from '../aws';
import logger from '../logs';
import generateSlug from '../utils/slugify';
import { subscribe } from '../mailchimp';

import Chapter from './Chapter';
import User from './User';
import Purchase from './Purchase';
import getEmailTemplate from './EmailTemplate';

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
      .limit(limit);
    return { books };
  }

  static async getBySlug({ slug, userId }) {
    const bookDoc = await this.findOne({ slug });
    if (!bookDoc) {
      throw new Error('Book not found');
    }

    const book = bookDoc.toObject();

    book.chapters = (await Chapter.find({ bookId: book._id }, 'title slug').sort({
      order: 1,
    })).map(ch => ch.toObject());

    if (userId) {
      const purchase = await Purchase.findOne({ userId, bookId: book._id }, 'doneChapterIds');

      book.isPurchased = !!purchase;

      if (purchase && purchase.doneChapterIds) {
        book.chapters.forEach((ch) => {
          Object.assign(ch, {
            isFinished: _.some(purchase.doneChapterIds, id => id.equals(ch._id)),
          });
        });
      }
    }

    return book;
  }

  static async add({
    name,
    price,
    textNearButton = '',
    githubRepo,
    supportURL = '',
  }) {
    const slug = await generateSlug(this, name);

    return this.create({
      name,
      slug,
      price,
      textNearButton,
      githubRepo,
      supportURL,
      createdAt: new Date(),
    });
  }

  static async edit({
    id,
    name,
    price,
    textNearButton = '',
    githubRepo,
    supportURL = '',
  }) {
    const book = await this.findById(id, 'slug name');

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
        await Chapter.syncContent({ book, data });
        logger.info('Content is synced', { path: f.path });
      } catch (error) {
        logger.error('Content sync has error', { path: f.path, error });
      }
    }));

    return this.findByIdAndUpdate(book._id, { githubLastCommitSha: lastCommitSha });
  }

  static async buy({ id, user, stripeToken }) {
    const book = await this.findById(id, 'name slug price').lean();
    if (!book) {
      throw new Error('Book not found');
    }

    if (!user) {
      throw new Error('User required');
    }

    const isPurchased =
      (await Purchase.find({ userId: user._id, bookId: book._id }).count()) > 0;
    if (isPurchased) {
      throw new Error('Already bought this book');
    }

    const chargeObj = await stripeCharge({
      amount: book.price * 100,
      token: stripeToken.id,
      bookName: book.name,
      buyerEmail: user.email,
    });

    User.findByIdAndUpdate(user.id, { $addToSet: { purchasedBookIds: book._id } }).exec();

    const template = await getEmailTemplate('purchased', {
      userName: user.displayName,
      bookTitle: book.name,
      bookUrl: `https://builderbook.org/books/${book.slug}/introduction`,
    });

    try {
      await sendEmail({
        from: `Kelly from builderbook.org <${process.env.EMAIL_SUPPORT_FROM_ADDRESS}>`,
        to: [user.email],
        subject: template.subject,
        body: template.message,
      });
    } catch (error) {
      logger.error('Email sending error:', error);
    }

    try {
      await subscribe({
        email: user.email,
        listName: 'purchased',
      });
    } catch (error) {
      logger.error('Mailchimp error:', error);
    }

    return Purchase.create({
      userId: user._id,
      bookId: book._id,
      amount: book.price * 100,
      createdAt: new Date(),
      stripeCharge: chargeObj,
    });
  }
  
  static async getPurchasedBooks({ purchasedBookIds, freeBookIds }) {
    const allBooks = await this.find().sort({ createdAt: -1 });

    const purchasedBooks = [];
    const freeBooks = [];
    const otherBooks = [];

    allBooks.forEach((b) => {
      if (purchasedBookIds.includes(b.id)) {
        purchasedBooks.push(b);
      } else if (freeBookIds.includes(b.id)) {
        freeBooks.push(b);
      } else {
        otherBooks.push(b);
      }
    });

    return { purchasedBooks, freeBooks, otherBooks };
  }

  static async giveFree({ id, userId }) {
    const book = await this.findById(id, 'id');
    if (!book) {
      throw new Error('Book not found');
    }

    if (!userId) {
      throw new Error('User ID required');
    }

    const isPurchased = (await Purchase.find({ userId, bookId: id }).count()) > 0;
    if (isPurchased) {
      throw new Error('Already bought this book');
    }

    User.findByIdAndUpdate(userId, { $addToSet: { freeBookIds: book.id } }).exec();

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

export default Book;
