import React from 'react';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import Error from 'next/error';
import Head from 'next/head';
import Link from 'next/link';
import Button from '@material-ui/core/Button';

import { getBookDetail, syncOneChapter, syncAllChapters } from '../../lib/api/admin';
import withAuth from '../../lib/withAuth';
import notify from '../../lib/notifier';

const handleSyncOneChapter = async (event) => {
  NProgress.start();
  try {
    const { bookid: bookId, chapterid: chapterId } = event.currentTarget.dataset;
    await syncOneChapter({ bookId, chapterId });
    notify('Synced');
    NProgress.done();
  } catch (err) {
    notify(err);
    NProgress.done();
  }
};

const handleSyncAllChapters = async (event) => {
  NProgress.start();
  try {
    const { bookid: bookId } = event.currentTarget.dataset;
    await syncAllChapters({ bookId });
    notify('Synced');
    NProgress.done();
  } catch (err) {
    notify(err);
    NProgress.done();
  }
};

const MyBook = ({ book, error }) => {
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
      <Head>
        <title>{book.name}</title>
        <meta name="description" content={`Details for book: ${book.name}`} />
      </Head>
      <h2>{book.name}</h2>
      <a href={`https://github.com/${book.githubRepo}`} target="_blank" rel="noopener noreferrer">
        Repo on Github
      </a>
      <p />
      <Button variant="contained" data-bookid={book._id} onClick={handleSyncAllChapters}>
        Sync all chapters
      </Button>
      <Link as={`/admin/edit-book/${book.slug}`} href={`/admin/edit-book?slug=${book.slug}`}>
        <Button variant="contained" style={{ marginLeft: '20px' }}>
          Edit book
        </Button>
      </Link>
      <ul style={{ listStyleType: 'none', padding: '10px 0px' }}>
        {chapters.map((ch) => (
          <li key={ch._id}>
            <Button data-bookid={book._id} data-chapterid={ch._id} onClick={handleSyncOneChapter}>
              Sync
            </Button>
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
};

MyBook.propTypes = {
  book: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    githubRepo: PropTypes.string.isRequired,
    chapters: PropTypes.arrayOf({
      _id: PropTypes.string.isRequired,
    }),
  }),
  error: PropTypes.string,
};

MyBook.defaultProps = {
  book: null,
  error: null,
};

class MyBookWithData extends React.Component {
  static propTypes = {
    slug: PropTypes.string.isRequired,
  };

  static getInitialProps({ query }) {
    return { slug: query.slug };
  }

  state = {
    loading: true,
    error: null,
    book: null,
  };

  async componentDidMount() {
    NProgress.start();
    try {
      const { slug } = this.props;
      const book = await getBookDetail({ slug });
      this.setState({ book, loading: false }); // eslint-disable-line
      NProgress.done();
    } catch (err) {
      this.setState({ loading: false, error: err.message || err.toString() }); // eslint-disable-line
      NProgress.done();
    }
  }

  render() {
    return <MyBook {...this.props} {...this.state} />;
  }
}

export default withAuth(MyBookWithData);
