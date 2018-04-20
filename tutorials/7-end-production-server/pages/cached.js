import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { getData } from '../lib/api/public';
import withLayout from '../lib/withLayout';

class Cached extends React.Component {
  static async getInitialProps() {
    const list = await getData();
    return { list };
  }

  render() {
    const { list } = this.props;
    return (
      <div style={{ textAlign: 'center', margin: '0 20px' }}>
        <Head>
          <title>Cached page</title>
          <meta name="description" content="description for search engine bots" />
        </Head>
        <br />
        <h3 style={{ textAlign: 'left' }}>List</h3>
        {list.array.length > 0 ? (
          <ul style={{ textAlign: 'left' }}>
            {list.array.map(i => <li key={i.name}>{i.name}</li>)}
          </ul>
        ) : null}
      </div>
    );
  }
}

Cached.propTypes = {
  list: PropTypes.shape({
    array: PropTypes.array.isRequired,
  }).isRequired,
};

export default withLayout(Cached);
