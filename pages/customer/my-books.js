import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Head from 'next/head';

import Error from 'next/error';
import NProgress from 'nprogress';

import { getMyBookList, getMyBookmarksList } from '../../lib/api/customer';
import notify from '../../lib/notifier';
import withAuth from '../../lib/withAuth';

function renderBookRow(book) {
  return (
    <li key={book._id}>
      <Link
        as={`/books/${book.slug}/introduction`}
        href={`/public/read-chapter?bookSlug=${book.slug}&chapterSlug=introduction`}
      >
        <a>{book.name}</a>
      </Link>
    </li>
  );
}

function renderFreeBookRow(book) {
  return (
    <li key={book._id}>
      <Link
        as={`/books/${book.slug}/introduction`}
        href={`/public/read-chapter?bookSlug=${book.slug}&chapterSlug=introduction`}
      >
        <a>{book.name}</a>
      </Link>
      <span> (free book from Team Builder Book)</span>
    </li>
  );
}

function renderBookmarkListItem(bookmark) {
  return (
    <div key={bookmark.bookSlug}>
      <p>
        Book: &nbsp;
        {bookmark.bookName}
      </p>
      <ul>
        {bookmark.bookmarksArray.map((bookmarkItem) => (
          <li key={bookmarkItem._id}>
            <a
              href={`/books/${bookmark.bookSlug}/${bookmarkItem.chapterSlug}#${bookmarkItem.hash}`}
            >
              Chapter &nbsp;
              {bookmarkItem.chapterOrder - 1},
              section &nbsp;
              {bookmarkItem.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MyBooks({ purchasedBooks, freeBooks, otherBooks, bookmarks, error, loading }) {
  if (error) {
    notify(error);
    return <Error statusCode={500} />;
  }

  if (loading) {
    return (
      <div style={{ padding: '10px 45px' }}>
        <p>loading...</p>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>My Books</title>
        <meta name="description" content="List of your books and bookmarks." />
      </Head>
      <div style={{ padding: '10px 45px' }}>
        {purchasedBooks && purchasedBooks.length > 0 ? (
          <div>
            <h3>Your books</h3>
            <ul>{purchasedBooks.map((book) => renderBookRow(book))}</ul>
          </div>
        ) : (
          <div>
            <h3>Your books</h3>
            <p>You have not purchased any book.</p>
          </div>
        )}

        {freeBooks && freeBooks.length > 0 ? (
          <ul>{freeBooks.map((book) => renderFreeBookRow(book))}</ul>
        ) : null}

        {otherBooks && otherBooks.length > 0 ? (
          <div>
            <h3>Books available for purchase</h3>
            <ul>{otherBooks.map((book) => renderBookRow(book))}</ul>
          </div>
        ) : null}

        {bookmarks && bookmarks.length > 0 ? (
          <div>
            <h3>Your bookmarks</h3>
            {bookmarks.map((bookmark) => renderBookmarkListItem(bookmark))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

MyBooks.propTypes = {
  purchasedBooks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ),
  freeBooks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ),
  otherBooks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ),
  bookmarks: PropTypes.arrayOf(
    PropTypes.shape({
      bookName: PropTypes.string.isRequired,
    }),
  ),
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
};

MyBooks.defaultProps = {
  error: null,
  purchasedBooks: null,
  freeBooks: null,
  otherBooks: null,
  bookmarks: null,
};

class MyBooksWithData extends React.Component {
  state = {
    loading: true,
    error: null,
    purchasedBooks: null,
    freeBooks: null,
    otherBooks: null,
    bookmarks: null,
  };

  async componentDidMount() {
    NProgress.start();

    try {
      const { purchasedBooks, freeBooks, otherBooks } = await getMyBookList();
      const { bookmarks } = await getMyBookmarksList();
      // eslint-disable-next-line
      this.setState({
        purchasedBooks,
        freeBooks,
        otherBooks,
        bookmarks,
        loading: false,
      });
      NProgress.done();
    } catch (err) {
      this.setState({ loading: false, error: err.message || err.toString() }); // eslint-disable-line
      NProgress.done();
    }
  }

  render() {
    return <MyBooks {...this.props} {...this.state} />;
  }
}

export default withAuth(MyBooksWithData);
