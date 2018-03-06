import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Head from 'next/head';

import { getMyBookList } from '../../lib/api/customer';
import withLayout from '../../lib/withLayout';
import withAuth from '../../lib/withAuth';

class MyBooks extends React.Component {
  static propTypes = {
    purchasedBooks: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
    })),
  };
  static defaultProps = {
    purchasedBooks: [],
  };

  static async getInitialProps({ req, res }) {
    const headers = {};
    if (req && req.headers && req.headers.cookie) {
      headers.cookie = req.headers.cookie;
    }

    try {
      const { purchasedBooks } = await getMyBookList({ headers });
      return { purchasedBooks };
    } catch (err) {
      if (err.message === 'Unauthorized' && res) {
        res.redirect('/login');
      } else {
        throw err;
      }

      return { purchasedBooks: [] };
    }
  }

  render() {
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

    const { purchasedBooks } = this.props;

    return (
      <div>
        <Head>
          <title>My Books</title>
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
        </div>
      </div>
    );
  }
}

export default withAuth(withLayout(MyBooks));
