import Head from 'next/head';
import Button from '@mui/material/Button';

const Index = () => (
  <div style={{ padding: '10px 45px' }}>
    <Head>
      <title>Index Page</title>
      <meta name="description" content="This is the description of the Index page." />
    </Head>

    <p>Content on Index Page</p>
    <Button variant="contained">MUI button</Button>
  </div>
);

export default Index;
