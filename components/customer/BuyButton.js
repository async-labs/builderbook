/* global StripePublishableKey */

import React from 'react';
import PropTypes from 'prop-types';
import StripeCheckout from 'react-stripe-checkout';
import NProgress from 'nprogress';
import Button from 'material-ui/Button';
import Link from 'next/link';

import { buyBook } from '../../lib/api/customer';
import notify from '../../lib/notifier';

const styleBuyButton = {
  margin: '10px 20px 0px 0px',
  font: '14px Muli',
};

class BuyButton extends React.PureComponent {
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
      const next = `${window.location.pathname}?buy=1`;
      window.location.href = `/auth/google?next=${next}`;
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
            variant="raised"
            color="primary"
            style={styleBuyButton}
            onClick={this.onLoginClicked}
          >
            Buy book for ${book.price}
          </Button>
          <Link prefetch as="/book-reviews" href="/book-reviews">
            <Button variant="raised" color="secondary" style={styleBuyButton}>
              See Reviews
            </Button>
          </Link>
          <p style={{ verticalAlign: 'middle', fontSize: '15px' }}>{book.textNearButton}</p>
          <hr />
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
        <Button variant="raised" color="primary" style={styleBuyButton}>
          Buy book for ${book.price}
        </Button>
        <p style={{ verticalAlign: 'middle', fontSize: '15px' }}>{book.textNearButton}</p>
        <hr />
      </StripeCheckout>
    );
  }
}

export default BuyButton;
