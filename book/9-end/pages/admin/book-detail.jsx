import React from 'react';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import Error from 'next/error';
import Link from 'next/link';
import Button from '@mui/material/Button';

import { getBookDetailApiMethod, syncBookContentApiMethod } from '../../lib/api/admin';
import withAuth from '../../lib/withAuth';
import notify from '../../lib/notify';

const propTypes = {
  slug: PropTypes.string.isRequired,
};

class BookDetail extends React.Component {
  static getInitialProps({ query }) {
    return { slug: query.slug };
  }

  constructor(props) {
    super(props);

    this.state = {
      book: null,
      error: null,
    };
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

  async handleSyncContent() {
    const bookId = this.state.book._id;

    try {
      await syncBookContentApiMethod({ bookId });
      notify('Synced');
    } catch (err) {
      notify(err);
    }
  }

  render() {
    const { book, error } = this.state;

    if (error) {
      notify(error);
      return <Error statusCode={500} />;
    }

    if (!book) {
      return null;
    }

    const { chapters = [] } = book;

    return (
      <div style={{ padding: '10px 45px' }}>
        <h2>{book.name}</h2>
        <a href={`https://github.com/${book.githubRepo}`} target="_blank" rel="noopener noreferrer">
          Repo on Github
        </a>
        <p />
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.handleSyncContent()}
          style={{ marginRight: '20px' }}
        >
          Sync with Github
        </Button>
        <Link href={`/admin/edit-book?slug=${book.slug}`} as={`/admin/edit-book/${book.slug}`}>
          <Button variant="contained" color="primary">
            Edit book
          </Button>
        </Link>
        <ul>
          {chapters.map((ch) => (
            <li key={ch._id}>
              <Link
                as={`/books/${book.slug}/${ch.slug}`}
                href={`/public/read-chapter?bookSlug=${book.slug}&chapterSlug=${ch.slug}`}
              >
                <a>{ch.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

BookDetail.propTypes = propTypes;

export default withAuth(BookDetail, { adminRequired: true });
