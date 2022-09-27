import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import Button from '@mui/material/Button';

import withAuth from '../lib/withAuth';
import notify from '../lib/notify';

const propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string.isRequired,
  }),
};

const defaultProps = {
  user: null,
};

// eslint-disable-next-line react/prefer-stateless-function
class Index extends React.Component {
  render() {
    const { user } = this.props;
    return (
      <div style={{ padding: '10px 45px' }}>
        <Head>
          <title>Settings</title>
          <meta name="description" content="List of purchased books." />
        </Head>
        <p>List of purchased books</p>
        <p>Email:&nbsp;{user.email}</p>

        <Button variant="contained" onClick={() => notify('success message')}>
          Click me to test notify and Notifier
        </Button>
      </div>
    );
  }
}

Index.propTypes = propTypes;
Index.defaultProps = defaultProps;

export default withAuth(Index);
