import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
// import Error from 'next/error';

import EditBook from '../../components/admin/EditBook';
import { getBookDetailApiMethod, editBookApiMethod } from '../../lib/api/admin';
import withAuth from '../../lib/withAuth';
import notify from '../../lib/notify';

const propTypes = {
  slug: PropTypes.string.isRequired,
};

function EditBookPage({ slug }) {
  const [book, setBook] = useState(null);

  useEffect(() => {
    const getBook = async () => {
      NProgress.start();

      try {
        const bookFromServer = await getBookDetailApiMethod({ slug });
        setBook(bookFromServer);
      } catch (err) {
        notify(err.message || err.toString());
      } finally {
        NProgress.done();
      }
    };

    getBook();
  }, []);

  const editBookOnSave = async (data) => {
    NProgress.start();

    try {
      const editedBook = await editBookApiMethod({ ...data, id: book._id });
      notify('Saved');

      Router.push(
        `/admin/book-detail?slug=${editedBook.slug}`,
        `/admin/book-detail/${editedBook.slug}`,
      );
    } catch (err) {
      notify(err);
    } finally {
      NProgress.done();
    }
  };

  if (!book) {
    // return <Error statusCode={500} />;
    return null;
  }

  return (
    <div>
      <EditBook onSave={editBookOnSave} book={book} />
    </div>
  );
}

EditBookPage.getInitialProps = async ({ query }) => {
  return { slug: query.slug };
};

EditBookPage.propTypes = propTypes;

export default withAuth(EditBookPage, { adminRequired: true });
