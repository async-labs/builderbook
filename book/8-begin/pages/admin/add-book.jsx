import React from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';

import withAuth from '../../lib/withAuth';
import EditBook from '../../components/admin/EditBook';
import { addBookApiMethod, syncBookContentApiMethod } from '../../lib/api/admin';
import notify from '../../lib/notifier';

class AddBook extends React.Component {
  addBookOnSave = async (data) => {
    NProgress.start();

    try {
      const book = await addBookApiMethod(data);
      notify('Saved');
      try {
        const bookId = book._id;
        await syncBookContentApiMethod({ bookId });
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
        <EditBook onSave={this.addBookOnSave} />
      </div>
    );
  }
}

export default withAuth(AddBook);
