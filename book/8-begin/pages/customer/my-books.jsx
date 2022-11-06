import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Head from 'next/head';

import { getMyBookListApiMethod } from '../../lib/api/customer';
import withAuth from '../../lib/withAuth';

const propTypes = {
  purchasedBooks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ),
};

const defaultProps = {
  purchasedBooks: [],
};

class MyBooks extends React.Component {
  static async getInitialProps({ req, res }) {
    if (req && !req.user) {
      res.redirect('/login');
      return { purchasedBooks: [] };
    }

    const headers = {};
    if (req && req.headers && req.headers.cookie) {
      headers.cookie = req.headers.cookie;
    }

    const { purchasedBooks } = await getMyBookListApiMethod({ headers });
    return { purchasedBooks };
  }

  render() {
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
              <ul>
                {purchasedBooks.map((book) => (
                  <li key={book._id}>
                    <Link
                      as={`/books/${book.slug}/introduction`}
                      href={`/public/read-chapter?bookSlug=${book.slug}&chapterSlug=introduction`}
                    >
                      <a>{book.name}</a>
                    </Link>
                  </li>
                ))}
              </ul>
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

MyBooks.propTypes = propTypes;
MyBooks.defaultProps = defaultProps;

export default withAuth(MyBooks);
