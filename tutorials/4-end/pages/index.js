import React from 'react';
import Head from 'next/head';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Notifier, { openSnackbar } from '../components/Notifier';
import withLayout from '../lib/withLayout';

class Notify extends React.Component {
  showNotifier = (event) => {
    event.preventDefault();

    const answer = (this.answerInput && this.answerInput.value) || null;

    if (this.answerInput && !answer) {
      openSnackbar({ message: 'Empty field. Enter a number.' });
    }

    if (answer && parseInt(answer, 10) === 4) {
      openSnackbar({ message: 'Correct answer!' });
    } else if (answer && parseInt(answer, 10) !== 4) {
      openSnackbar({ message: 'Incorrect answer.' });
    }
  }

  render() {
    return (
      <div style={{ padding: '10px 45px' }}>
        <Head>
          <title>Notifier component</title>
          <meta name="description" content="description for indexing bots" />
        </Head>
        <br />
        <Notifier />
        <form onSubmit={this.showNotifier}>
          <p> What is 2+2? </p>
          <TextField
            inputRef={(elm) => {
              this.answerInput = elm;
            }}
            type="number"
            label="Type your answer"
            style={{
              font: '15px Muli',
              color: '#222',
              fontWeight: '300',
            }}
          />
          <p />
          <Button
            variant="raised"
            color="primary"
            type="submit"
          >
            Submit
          </Button >
        </form>
      </div >
    );
  }
}

export default withLayout(Notify);
