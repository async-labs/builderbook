/* eslint react/prefer-stateless-function: 0 */

import React from 'react';
import Head from 'next/head';

import SubscribeForm from '../components/SubscribeForm';
import withAuth from '../lib/withAuth';
import withLayout from '../lib/withLayout';

class Index extends React.Component {
  render() {
    return (
      <div style={{ padding: '10px 45px' }}>
        <Head>
          <title>Subscribe</title>
          <meta name="description" content="description for indexing bots" />
        </Head>
        <br />
        <p> Mailchimp form goes here </p>
        <SubscribeForm />

      </div>
    );
  }
}

export default withAuth(withLayout(Index), { logoutRequired: true });
