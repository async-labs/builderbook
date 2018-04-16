import React from 'react';
import Head from 'next/head';
import Button from 'material-ui/Button';

import withLayout from '../lib/withLayout';
import { sendRequestToMainProcess, sendRequestToForkedProcess } from '../lib/api/public';

class Index extends React.Component {
  mainProcessButton = async () => {
    try {
      const sum = await sendRequestToMainProcess();
      alert(sum); //eslint-disable-line
    } catch (err) {
      console.log(err); //eslint-disable-line
    }
  };

  forkedProcessButton = async () => {
    try {
      const sum = await sendRequestToForkedProcess();
      alert(sum); //eslint-disable-line
    } catch (err) {
      console.log(err); //eslint-disable-line
    }
  };

  render() {
    return (
      <div style={{ padding: '10px 45px' }}>
        <Head>
          <title>Scaling Node</title>
          <meta name="description" content="Main vs forked process in Node" />
        </Head>
        <br />
        <Button variant="raised" color="secondary" onClick={this.mainProcessButton}>
          Send request to main/parent Node process
        </Button>
        <br />
        <br />
        <Button variant="raised" color="primary" onClick={this.forkedProcessButton}>
          Send request to forked/child Node process
        </Button>
      </div>
    );
  }
}

export default withLayout(Index);
