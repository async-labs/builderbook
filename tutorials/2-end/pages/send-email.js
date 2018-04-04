import React from 'react';
import Head from 'next/head';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import NProgress from 'nprogress';

import { styleTextField } from '../components/SharedStyles';
import withLayout from '../lib/withLayout';
import { sendRequestToServer } from '../lib/api/public';

class SendEmail extends React.Component {
  onSubmit = async (e) => {
    e.preventDefault();

    const email = (this.emailInput && this.emailInput.value) || null;
    if (this.emailInput && !email) {
      return;
    }

    NProgress.start();
    try {
      await sendRequestToServer({ email });

      if (this.emailInput) {
        this.emailInput.value = '';
      }

      console.log('Email was sent'); //eslint-disable-line
      NProgress.done();
    } catch (err) {
      console.log(err); //eslint-disable-line
      NProgress.done();
    }
  };

  render() {
    return (
      <div style={{ padding: '10px 45px' }}>
        <Head>
          <title>AWS SES</title>
          <meta name="description" content="description for indexing bots" />
        </Head>
        <br />
        This app was created for
        <a
          href="https://codeburst.io/add-transactional-emails-to-a-javascript-web-app-react-express-9fa1ff2e40e0"
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}this tutorial
        </a>.
        <br />
        <form onSubmit={this.onSubmit}>
          <p>Add your email address and app will send you email via AWS SES:</p>
          <TextField
            inputRef={(elm) => {
              this.emailInput = elm;
            }}
            type="email"
            label="Your email"
            style={styleTextField}
            required
          />
          <p />
          <Button variant="raised" color="primary" type="submit">
            Send email with AWS SES
          </Button>
        </form>
      </div>
    );
  }
}

export default withLayout(SendEmail);
