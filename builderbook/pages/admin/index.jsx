import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import NProgress from 'nprogress';

import Button from '@mui/material/Button';

import notify from '../../lib/notify';

import withAuth from '../../lib/withAuth';
import { getBookListApiMethod } from '../../lib/api/admin';

const propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const Index = ({ books }) => (
  <div style={{ padding: '10px 45px' }}>
    <div>
      <h2>Books</h2>
      <Link href="/admin/add-book">
        <Button variant="contained" color="primary">
          Add book
        </Button>
      </Link>
      <p />
      <ul>
        {books.map((b) => (
          <li key={b._id}>
            <Link as={`/admin/book-detail/${b.slug}`} href={`/admin/book-detail?slug=${b.slug}`}>
              <a>{b.name}</a>
            </Link>
          </li>
        ))}
      </ul>
      <br />
    </div>
  </div>
);

Index.propTypes = propTypes;

const propTypes2 = {
  errorMessage: PropTypes.string,
};

const defaultProps2 = {
  errorMessage: null,
};

function IndexWithData({ errorMessage }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (errorMessage) {
      notify(errorMessage);
    }

    const getBooks = async () => {
      NProgress.start();

      try {
        const { booksFromServer } = await getBookListApiMethod();
        setBooks(booksFromServer);
      } catch (err) {
        notify(err);
      } finally {
        NProgress.done();
      }
    };

    getBooks();
  }, []);

  return <Index books={books} />;
}

IndexWithData.propTypes = propTypes2;
IndexWithData.defaultProps = defaultProps2;

export default withAuth(IndexWithData, { adminRequired: true });
