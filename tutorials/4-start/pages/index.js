import React from 'react';
import Head from 'next/head';
import Button from 'material-ui/Button';
import withLayout from '../lib/withLayout';

function Notify() {
  return (
    <div style={{ padding: '10px 45px' }}>
      <Head>
        <title>Notifier component</title>
        <meta name="description" content="description for indexing bots" />
      </Head>
      <br />
      <Button
        variant="raised"
        color="primary"
      >
        Notify me
      </Button >
    </div >
  );
}

export default withLayout(Notify);
