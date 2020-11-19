import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Button from '@material-ui/core/Button';

import notify from '../../lib/notifier';

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

const propTypes2 = {
  errorMessage: PropTypes.string,
};

const defaultProps2 = {
  errorMessage: null,
};

class IndexWithData extends React.Component {
  static getInitialProps({ query }) {
    return { errorMessage: query.error };
  }

  constructor(props) {
    super(props);

    this.state = {
      books: [],
    };
  }

  async componentDidMount() {
    if (this.props.errorMessage) {
      notify(this.props.errorMessage);
    }

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

IndexWithData.propTypes = propTypes2;
IndexWithData.defaultProps = defaultProps2;

export default withAuth(IndexWithData, { adminRequired: true });
