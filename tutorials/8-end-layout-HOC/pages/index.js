import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import withLayout from '../lib/withLayout';

function Index({ user }) {
  return (
    <div style={{ padding: '10px 45px' }}>
      <Head>
        <title>Index page</title>
        <meta name="description" content="description for indexing bots" />
      </Head>
      <p>Email from HOC: {user.email}</p>
    </div>
  );
}

Index.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
  }),
};

Index.defaultProps = {
  user: null,
};

export default withLayout(Index);
