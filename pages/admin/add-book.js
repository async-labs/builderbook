import React from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import Head from 'next/head';

import withLayout from '../../lib/withLayout';
import withAuth from '../../lib/withAuth';
import EditBook from '../../components/admin/EditBook';
import { addBook, syncBookContent } from '../../lib/api/admin';
import notify from '../../lib/notifier';

class AddBook extends React.Component {
  addBookOnSave = async (data) => {
    NProgress.start();

    try {
      const book = await addBook(data);
      notify('Saved');
      try {
        const bookId = book._id;
        await syncBookContent({ bookId });
        notify('Synced');
        NProgress.done();
        Router.push(`/admin/book-detail?slug=${book.slug}`, `/admin/book-detail/${book.slug}`);
      } catch (err) {
        notify(err);
        NProgress.done();
      }
    } catch (err) {
      notify(err);
      NProgress.done();
    }
  };

  render() {
    return (
      <div style={{ padding: '10px 45px' }}>
        <Head>
          <title>Add Book</title>
          <meta name="description" content="Add new book" />
        </Head>
        <EditBook onSave={this.addBookOnSave} />
      </div>
    );
  }
}

export default withAuth(withLayout(AddBook));
