import Head from 'next/head';
import Button from '@material-ui/core/Button';
import withLayout from '../lib/withLayout';

const Index = () => (
  <div style={{ padding: '10px 45px' }}>
    <Head>
      <title>Index page</title>
      <meta name="description" content="This is a description of the Index page" />
    </Head>
    <p>Content on Index page</p>
    <Button variant="raised">MUI button</Button>
  </div>
);

export default withLayout(Index);
