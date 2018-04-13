import React from 'react';
import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import Grid from 'material-ui/Grid';

import notify from '../../lib/notifier';

import withLayout from '../../lib/withLayout';
import withAuth from '../../lib/withAuth';
import { getBookList } from '../../lib/api/admin';

const Index = ({ books }) => (
  <div style={{ padding: '10px 45px' }}>
    <Head>
      <title>Admin</title>
      <meta name="description" content="Settings for Admin" />
    </Head>
    <Grid container>
      <Grid item xs={12} sm={4}>
        <div>
          <h2>Books</h2>
          <Link href="/admin/add-book">
            <Button variant="raised">Add book</Button>
          </Link>
          <ul>
            {books.map(b => (
              <li key={b._id}>
                <Link
                  prefetch
                  as={`/admin/book-detail/${b.slug}`}
                  href={`/admin/book-detail?slug=${b.slug}`}
                >
                  <a>{b.name}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Grid>
    </Grid>
  </div>
);

Index.propTypes = {
  books: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
};

class IndexWithData extends React.Component {
  state = {
    books: [],
  };

  async componentDidMount() {
    try {
      const { books } = await getBookList();

      this.setState({ books }); // eslint-disable-line
    } catch (err) {
      notify(err);
    }
  }

  render() {
    return <Index {...this.props} {...this.state} />;
  }
}

export default withAuth(withLayout(IndexWithData), { adminRequired: true });
