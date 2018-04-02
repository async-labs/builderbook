import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import NProgress from 'nprogress';

import { getList } from '../lib/api/public';

import withLayout from '../lib/withLayout';

function CSR({ list, loading }) {
  if (loading) {
    return (
      <div style={{ padding: '10px 45px' }}>
        <p>loading...(CSR page without data)</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', margin: '0 20px' }}>
      <Head>
        <title>CSR page</title>
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

CSR.propTypes = {
  list: PropTypes.shape({
    listOfItems: PropTypes.array.isRequired,
  }),
  loading: PropTypes.bool,
};

CSR.defaultProps = {
  list: null,
  loading: true,
};

class CSRWithData extends React.Component {
  state = {
    list: null,
    loading: true,
  };

  async componentDidMount() {
    NProgress.start();
    try {
      const list = await getList();
      // console.log(list.listOfItems);
      this.setState({ // eslint-disable-line
        list,
        loading: false,
      });
      NProgress.done();
    } catch (err) {
      this.setState({ loading: false, error: err.message || err.toString() }); // eslint-disable-line
      NProgress.done();
    }
  }

  render() {
    return <CSR {...this.props} {...this.state} />;
  }
}


// works as well

export default withLayout(CSRWithData);
