/* globals StripePublishableKey */

import React from 'react';
import PropTypes from 'prop-types';
import StripeCheckout from 'react-stripe-checkout';
import NProgress from 'nprogress';

import Button from 'material-ui/Button';

import { buyBook } from '../../lib/api/customer';
import notify from '../../lib/notifier';

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
      setTimeout(() => window.location.reload(), 300);
      NProgress.done();
    } catch (err) {
      NProgress.done();
      notify(err);
    }
  };

  onLoginClicked = (e) => {
    const { user } = this.props;

    if (!user) {
      e.stopPropagation();
      const next = `${window.location.pathname}?buy=1`;
      window.location.href = `/auth/google?next=${next}`;
    }
  };

  render() {
    const { book, user } = this.props;
    const { showModal } = this.state;

    const preorderPrice = book.isInPreorder && book.preorderPrice;
    const price = preorderPrice || book.price;

    if (!book) {
      return null;
    }

    if (!user) {
      return (
        <div>
          <Button
            variant="raised"
            style={styleBuyButton}
            color="primary"
            onClick={this.onLoginClicked}
          >
            {preorderPrice ? 'Pre-order' : 'Buy'} for ${price}
          </Button>

          {preorderPrice ? (
            <span style={{ verticalAlign: 'middle', fontSize: '15px' }}>
              On March 15th, price becomes ${book.price}.
            </span>
          ) : null}
        </div>
      );
    }

    return (
      <StripeCheckout
        stripeKey={StripePublishableKey}
        token={this.onToken}
        name={book.name}
        amount={price * 100}
        email={user.email}
        desktopShowModal={showModal || null}
      >
        <Button style={styleBuyButton} variant="raised" color="primary">
          {preorderPrice ? 'Pre-order' : 'Buy'} for ${price}
        </Button>

        {preorderPrice ? (
          <span style={{ verticalAlign: 'middle', fontSize: '15px' }}>
            On March 15th, price becomes ${book.price}.
          </span>
        ) : null}
      </StripeCheckout>
    );
  }
}

export default BuyButton;
