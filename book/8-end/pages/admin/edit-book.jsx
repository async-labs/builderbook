import React from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import Error from 'next/error';

import EditBookComp from '../../components/admin/EditBook';
import { getBookDetailApiMethod, editBookApiMethod } from '../../lib/api/admin';
import withAuth from '../../lib/withAuth';
import notify from '../../lib/notifier';

const propTypes = {
  slug: PropTypes.string.isRequired,
};

class EditBook extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      book: null,
      error: null,
    };
  }

  static getInitialProps({ query }) {
    return { slug: query.slug };
  }

  async componentDidMount() {
    NProgress.start();

    try {
      const { slug } = this.props;
      const book = await getBookDetailApiMethod({ slug });
      this.setState({ book }); // eslint-disable-line
      NProgress.done();
    } catch (err) {
      this.setState({ error: err.message || err.toString() }); // eslint-disable-line
      NProgress.done();
    }
  }

  editBook = async (data) => {
    const { book } = this.state;
    NProgress.start();

    try {
      const editedBook = await editBookApiMethod({ ...data, id: book._id });
      notify('Saved');
      NProgress.done();
      Router.push(
        `/admin/book-detail?slug=${editedBook.slug}`,
        `/admin/book-detail/${editedBook.slug}`,
      );
    } catch (err) {
      notify(err);
      NProgress.done();
    }
  };

  render() {
    const { book, error } = this.state;

    if (error) {
      notify(error);
      return <Error statusCode={500} />;
    }

    if (!book) {
      return null;
    }

    return (
      <div>
        <EditBookComp onSave={this.editBook} book={book} />
      </div>
    );
  }
}

EditBook.propTypes = propTypes;

export default withAuth(EditBook);
