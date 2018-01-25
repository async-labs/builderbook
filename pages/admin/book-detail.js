import React from 'react';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import Error from 'next/error';
import Head from 'next/head';
import Link from 'next/link';
import Button from 'material-ui/Button';

import { getBookDetail, syncBookContent } from '../../lib/api/admin';
import withLayout from '../../lib/withLayout';
import withAuth from '../../lib/withAuth';
import notify from '../../lib/notifier';

const handleSyncContent = bookId => async () => {
  NProgress.start();
  try {
    await syncBookContent({ bookId });
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
      <p>
        <a href={`https://github.com/${book.githubRepo}`} target="_blank">
          {book.githubRepo}
        </a>
      </p>
      <Button raised onClick={handleSyncContent(book._id)}>
        Sync with Github
      </Button>{' '}
      <Link as={`/admin/edit-book/${book.slug}`} href={`/admin/edit-book?slug=${book.slug}`}>
        <Button raised>Edit book</Button>
      </Link>
      <ul>
        {chapters.map(ch => (
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
};

MyBook.propTypes = {
  book: PropTypes.shape({
    name: PropTypes.string.isRequired,
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
      const book = await getBookDetail({ slug: this.props.slug });
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

export default withAuth(withLayout(MyBookWithData));
