import React from 'react';
import Head from 'next/head';

import withLayout from '../lib/withLayout';

function Index() {
  return (
    <div style={{ padding: '10px 45px' }}>
      <Head>
        <title>Index page</title>
        <meta name="description" content="description for indexing bots" />
      </Head>
      <p> Content </p>
    </div>
  );
}

export default withLayout(Index);
