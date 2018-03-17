import React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import NProgress from 'nprogress';

import { styleTextField } from '../components/SharedStyles';
import { subscribeToTutorials } from '../lib/api/public';

class SubscribeForm extends React.Component {
  onSubmit = async (e) => {
    e.preventDefault();

    const email = (this.emailInput && this.emailInput.value) || null;

    if (this.emailInput && !email) {
      return;
    }

    NProgress.start();

    try {
      await subscribeToTutorials({ email });

      if (this.emailInput) {
        this.emailInput.value = '';
      }
      NProgress.done();
    } catch (err) {
      NProgress.done();
    }
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <p>We will email you when a new tutorial is released:</p>

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
        <Button variant="raised" type="submit">
          Subscribe
        </Button>
      </form>
    );
  }
}

export default SubscribeForm;
