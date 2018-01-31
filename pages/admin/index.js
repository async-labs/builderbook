import React from 'react';
import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import Grid from 'material-ui/Grid';

import notify from '../../lib/notifier';
import GiveFreeBook from '../../components/admin/GiveFreeBook';

import withLayout from '../../lib/withLayout';
import withAuth from '../../lib/withAuth';
import { syncTOS as syncTOSfn, getBookList } from '../../lib/api/admin';

const Index = ({
  books, syncTOS,
}) => (
  <div style={{ padding: '10px 45px' }}>
    <Head>
      <title>Admin</title>
      <meta name="description" content="settings for Admin" />
    </Head>
    <Grid container>
      <Grid item xs={12} sm={4}>
        <div>
          <h2>Books</h2>
          <ul>
            {books.map(b => (
              <li key={b._id}>
                <Link
                  as={`/admin/book-detail/${b.slug}`}
                  href={`/admin/book-detail?slug=${b.slug}`}
                >
                  <a>{b.name}</a>
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/admin/add-book">
            <Button raised>Add book</Button>
          </Link>
        </div>
        <br />
        <h2>Sync TOS</h2>
        <p>
          <Button raised onClick={syncTOS}>
            Sync TOS
          </Button>
        </p>
        <br />
      </Grid>

      <Grid item xs={12} sm={8}>
        <GiveFreeBook books={books} />
      </Grid>
    </Grid>
  </div>
);

Index.propTypes = {
  books: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
  syncTOS: PropTypes.func.isRequired,
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

  syncTOS = async () => {
    try {
      await syncTOSfn();
      notify('Synced!');
    } catch (err) {
      notify(err);
    }
  };

  render() {
    return <Index {...this.props} {...this.state} syncTOS={this.syncTOS} />;
  }
}

export default withAuth(withLayout(IndexWithData), { adminRequired: true });
