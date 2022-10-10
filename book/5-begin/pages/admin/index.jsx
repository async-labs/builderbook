import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Button from '@mui/material/Button';

import notify from '../../lib/notify';

import withAuth from '../../lib/withAuth';
import { getBookListApiMethod } from '../../lib/api/admin';

const propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

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

Index.propTypes = propTypes;

class IndexWithData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      books: [],
    };
  }

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

export default withAuth(IndexWithData);
