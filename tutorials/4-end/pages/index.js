import React from 'react';
import Head from 'next/head';
import Button from 'material-ui/Button';
import Notifier, { openSnackbar } from '../components/Notifier';
import withLayout from '../lib/withLayout';

class Notify extends React.Component {
  showNotifier = () => { openSnackbar({ message: 'success' }); };
  render() {
    return (
      <div style={{ padding: '10px 45px' }}>
        <Head>
          <title>Notifier component</title>
          <meta name="description" content="description for indexing bots" />
        </Head>
        <br />
        <Notifier />
        <Button
          variant="raised"
          color="primary"
          onClick={this.showNotifier}
        >
          Notify me
        </Button >
      </div >
    );
  }
}

export default withLayout(Notify);
