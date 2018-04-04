import React from 'react';
import Head from 'next/head';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import NProgress from 'nprogress';

import { styleTextField } from '../components/SharedStyles';
import withLayout from '../lib/withLayout';
import { subscribeToNewsletter } from '../lib/api/public';

class Subscribe extends React.Component {
  onSubmit = async (e) => {
    e.preventDefault();

    const email = (this.emailInput && this.emailInput.value) || null;
    if (this.emailInput && !email) {
      return;
    }

    NProgress.start();
    console.log('email was successfully added to Mailchimp list');
    try {
      await subscribeToNewsletter({ email });

      if (this.emailInput) {
        this.emailInput.value = '';
      }
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
          <title>Subscribe</title>
          <meta name="description" content="description for indexing bots" />
        </Head>
        <br />
        This app was created for
        <a
          href="https://medium.freecodecamp.org/how-to-integrate-mailchimp-in-a-javascript-web-app-2a889fb43f6f"
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}this tutorial
        </a>.
        <br />
        <form onSubmit={this.onSubmit}>
          <p>Your email will be added to Mailchimp list and you will get confirmation email:</p>
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
            Subscribe
          </Button>
        </form>
      </div>
    );
  }
}

export default withLayout(Subscribe);
