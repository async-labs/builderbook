import React from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';

import withLayout from '../../lib/withLayout';
import withAuth from '../../lib/withAuth';
import EditBook from '../../components/admin/EditBook';
import { addBook } from '../../lib/api/admin';
import notify from '../../lib/notifier';

class AddBook extends React.Component {
  addBookOnSave = async (data) => {
    NProgress.start();

    try {
      await addBook(data);
      notify('Saved');
      NProgress.done();
      Router.push('/admin');
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

export default withAuth(withLayout(AddBook));
