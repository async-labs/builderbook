import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import withAuth from '../lib/withAuth';

// eslint-disable-next-line react/prefer-stateless-function
class Index extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      displayName: PropTypes.string,
      email: PropTypes.string.isRequired,
    }),
  };

  static defaultProps = {
    user: null,
  };

  render() {
    const { user } = this.props;
    return (
      <div style={{ padding: '10px 45px' }}>
        <Head>
          <title>Dashboard</title>
          <meta name="description" content="List of purchased books." />
        </Head>
        <p> Dashboard </p>
        <p>
          Email:&nbsp;
          {user.email}
        </p>
      </div>
    );
  }
}

export default withAuth(Index);
