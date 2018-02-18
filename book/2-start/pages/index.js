import Head from 'next/head';

import withLayout from '../lib/withLayout';

const Index = () => (
  <div style={{ padding: '10px 45px' }}>
    <Head>
      <title>Index page</title>
      <meta name="description" content="This is SEO description of Index page" />
    </Head>
    <p>Content on Index page</p>
  </div>
);

export default withLayout(Index);
