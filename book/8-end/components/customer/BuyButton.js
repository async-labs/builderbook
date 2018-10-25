import React from 'react';
import PropTypes from 'prop-types';
import StripeCheckout from 'react-stripe-checkout';
import NProgress from 'nprogress';

import Button from '@material-ui/core/Button';

import { buyBook } from '../../lib/api/customer';
import notify from '../../lib/notifier';
import env from '../../lib/env';

const { StripePublishableKey } = env;

const styleBuyButton = {
  margin: '20px 20px 20px 0px',
  font: '14px Muli',
};

class BuyButton extends React.Component {
  static propTypes = {
    book: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
    showModal: PropTypes.bool,
  };

  static defaultProps = {
    book: null,
    user: null,
    showModal: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      showModal: !!props.showModal,
    };
  }

  onToken = async (token) => {
    NProgress.start();
    const { book } = this.props;
    this.setState({ showModal: false });

    try {
      await buyBook({ stripeToken: token, id: book._id });
      notify('Success!');
      window.location.reload(true);
      NProgress.done();
    } catch (err) {
      NProgress.done();
      notify(err);
    }
  };

  onLoginClicked = () => {
    const { user } = this.props;

    if (!user) {
      const redirectUrl = `${window.location.pathname}?buy=1`;
      window.location.href = `/auth/google?redirectUrl=${redirectUrl}`;
    }
  };

  render() {
    const { book, user } = this.props;
    const { showModal } = this.state;

    if (!book) {
      return null;
    }

    if (!user) {
      return (
        <div>
          <Button
            variant="contained"
            style={styleBuyButton}
            color="primary"
            onClick={this.onLoginClicked}
          >
            Buy book for ${book.price}
          </Button>
        </div>
      );
    }

    return (
      <StripeCheckout
        stripeKey={StripePublishableKey}
        token={this.onToken}
        name={book.name}
        amount={book.price * 100}
        email={user.email}
        desktopShowModal={showModal || null}
      >
        <Button variant="contained" style={styleBuyButton} color="primary">
          Buy book for ${book.price}
        </Button>
      </StripeCheckout>
    );
  }
}

export default BuyButton;
