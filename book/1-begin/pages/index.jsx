// ES6 class instead of stateless function
// import React from 'react';
//
// class Index extends React.Component {
//   render() {
//     return <div>some content</div>;
//   }
// };
import Head from 'next/head';
import Button from '@material-ui/core/Button';

const Index = () => (
  <div style={{ padding: '10px 45px' }}>
    <Head>
      <title>Index page</title>
      <meta name="description" content="This is the description of the Index page" />
    </Head>
    <p>Content on Index page</p>
    <Button variant="contained">MUI button</Button>
  </div>
);

export default Index;
