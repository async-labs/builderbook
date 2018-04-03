import React from 'react';
import Head from 'next/head';
import Button from 'material-ui/Button';
import Header from '../components/Header';
import Notifier, { openSnackbar } from '../components/Notifier';

class Notify extends React.Component {
  showNotifier = () => { openSnackbar({ message: 'success' }); };
  render() {
    return (
      <div>
        <Head>
          <title>Simple Notification Tutorial</title>
          <meta name="description" content="description for indexing bots" />
        </Head>
        <Header />
        <Notifier />
        <Button
          variant="raised"
          color="primary"
          style={{ margin: '30px' }}
          onClick={this.showNotifier}
        >
          Notify me
        </Button >
      </div >
    );
  }
}

export default Notify;
