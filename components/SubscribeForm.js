import React from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import NProgress from 'nprogress';

import notify from '../lib/notifier';
import { subscribeToTutorials } from '../lib/api/public';
import { styleTextField, styleRaisedButton } from '../components/SharedStyles';

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
      notify('Success!');
    } catch (err) {
      NProgress.done();
      notify(err);
    }
  };

  render() {
    return (
      <div style={{ padding: '20px' }}>
        <form onSubmit={this.onSubmit} style={{ textAlign: 'center' }}>
          <TextField
            inputRef={(elm) => {
              this.emailInput = elm;
            }}
            type="email"
            label="Your email"
            helperText="Powered by Mailchimp: unsubscribe with one click."
            style={styleTextField}
            required
          />
          <Button variant="raised" color="secondary" type="submit" style={styleRaisedButton}>
            Get updates
          </Button>
        </form>
      </div>
    );
  }
}

export default SubscribeForm;
