import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { getList } from '../lib/api/public';
import withLayout from '../lib/withLayout';

class SSR extends React.Component {
  static async getInitialProps() {
    // NProgress.start();
    const list = await getList();
    // NProgress.done();
    return { list };
  }

  render() {
    const { list } = this.props;
    return (
      <div style={{ textAlign: 'center', margin: '0 20px' }}>
        <Head>
          <title>SSR page</title>
          <meta name="description" content="description for indexing bots" />
        </Head>
        <br />
        <h3 style={{ textAlign: 'left' }}>List</h3>
        {list.listOfItems.length > 0 ? (
          <ul style={{ textAlign: 'left' }}>
            {list.listOfItems.map(i => <li key={i.name}>{i.name}</li>)}
          </ul>
        ) : null}
      </div>
    );
  }
}

// nice, example works
// no page, then page appears with all data
// describe why Nprogress does not work

SSR.propTypes = {
  list: PropTypes.shape({
    listOfItems: PropTypes.array.isRequired,
  }).isRequired,
};

export default withLayout(SSR);
