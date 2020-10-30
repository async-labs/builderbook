import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Button from '@material-ui/core/Button';

import notify from '../../lib/notifier';

import withAuth from '../../lib/withAuth';
import { getBookListApiMethod } from '../../lib/api/admin';

const Index = ({ books }) => (
  <div style={{ padding: '10px 45px' }}>
    <div>
      <h2>Books</h2>
      <Link href="/admin/add-book">
        <Button variant="contained">Add book</Button>
      </Link>
      <p />
      <ul>
        {books.map((b) => (
          <li key={b._id}>
            <Link as={`/admin/book-detail/${b.slug}`} href={`/admin/book-detail?slug=${b.slug}`}>
              <a>{b.name}</a>
            </Link>
          </li>
        ))}
      </ul>
      <br />
    </div>
  </div>
);

Index.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

class IndexWithData extends React.Component {
  state = {
    books: [],
  };

  async componentDidMount() {
    try {
      const { books } = await getBookListApiMethod();
      this.setState({ books }); // eslint-disable-line
    } catch (err) {
      notify(err);
    }
  }

  render() {
    return <Index {...this.state} />;
  }
}

export default withAuth(IndexWithData, { adminRequired: true });
