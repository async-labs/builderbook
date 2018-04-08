import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Error from 'next/error';
import Head from 'next/head';
import NProgress from 'nprogress';

import { getMyBookList } from '../../lib/api/customer';
import notify from '../../lib/notifier';
import withLayout from '../../lib/withLayout';
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

function MyBooks({
  purchasedBooks, freeBooks, otherBooks, error, loading,
}) {
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
        <meta name="description" content="List of purchased books" />
      </Head>
      <div style={{ padding: '10px 45px' }}>
        {purchasedBooks && purchasedBooks.length > 0 ? (
          <div>
            <h3>Your books</h3>
            <ul>{purchasedBooks.map(book => renderBookRow(book))}</ul>
          </div>
        ) : (
          <div>
            <h3>Your books</h3>
            <p>You have not purchased any book.</p>
          </div>
          )}

        {freeBooks && freeBooks.length > 0 ? (
          <ul>{freeBooks.map(book => renderFreeBookRow(book))}</ul>
        ) : null}

        {otherBooks && otherBooks.length > 0 ? (
          <div>
            <h3>Available books</h3>
            <p>Check out books available for purchase:</p>
            <ul>{otherBooks.map(book => renderBookRow(book))}</ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

MyBooks.propTypes = {
  purchasedBooks: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })),
  freeBooks: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })),
  otherBooks: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })),
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
};

MyBooks.defaultProps = {
  error: null,
  purchasedBooks: null,
  freeBooks: null,
  otherBooks: null,
};

class MyBooksWithData extends React.Component {
  state = {
    loading: true,
    error: null,
    purchasedBooks: null,
    freeBooks: null,
    otherBooks: null,
  };

  async componentDidMount() {
    NProgress.start();

    try {
      const { purchasedBooks, freeBooks, otherBooks } = await getMyBookList();
      this.setState({ // eslint-disable-line
        purchasedBooks,
        freeBooks,
        otherBooks,
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

export default withAuth(withLayout(MyBooksWithData));
