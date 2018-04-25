import React from 'react';
import Head from 'next/head';
import Button from 'material-ui/Button';

import withLayout from '../lib/withLayout';
import { sendRequestToMainProcess, sendRequestToForkedProcess } from '../lib/api/public';

class Index extends React.Component {
  mainProcessButton = async () => {
    try {
      const sum = await sendRequestToMainProcess();
      alert(`Calculated by main process: ${sum}`); //eslint-disable-line
    } catch (err) {
      console.log(err); //eslint-disable-line
    }
  };

  forkedProcessButton = async () => {
    try {
      const sum = await sendRequestToForkedProcess();
      alert(`Calculated by forked process: ${sum}`); //eslint-disable-line
    } catch (err) {
      console.log(err); //eslint-disable-line
    }
  };

  render() {
    return (
      <div style={{ padding: '10px 45px' }}>
        <Head>
          <title>Scaling Node server: main vs forked process.</title>
          <meta name="description" content="Scaling Node server: isolate CPU-intensive tasks in forked process." />
        </Head>
        <br />
        <br />
        <Button variant="raised" color="secondary" onClick={this.mainProcessButton}>
          Execute task in main Node process
        </Button>
        <br />
        <br />
        <Button variant="raised" color="primary" onClick={this.forkedProcessButton}>
          Execute task in forked Node process
        </Button>
        <br />
        <br />
        <br />
        <hr />
        <span>Click this link right after clicking on any of the above buttons: </span>
        <a href="/" target="_blank">
          Open page in new tab
        </a>
      </div>
    );
  }
}

export default withLayout(Index);
