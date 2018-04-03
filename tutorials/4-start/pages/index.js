import React from 'react';
import Head from 'next/head';
import Button from 'material-ui/Button';
import Header from '../components/Header';

function Notify() {
  return (
    <div>
      <Head>
        <title>Simple Notification Tutorial</title>
        <meta name="description" content="description for indexing bots" />
      </Head>
      <Header />
      <Button
        variant="raised"
        color="primary"
        style={{ margin: '30px' }}
      >
        Notify me
      </Button >
    </div >
  );
}

export default Notify;
