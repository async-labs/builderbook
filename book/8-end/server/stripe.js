const stripe = require('stripe');

function stripeCharge({ amount, token, buyerEmail }) {
  const dev = process.env.NODE_ENV !== 'production';
  const API_KEY = dev ? process.env.Stripe_Test_SecretKey : process.env.Stripe_Live_SecretKey;
  const client = stripe(API_KEY);

  return client.charges.create({
    amount,
    currency: 'usd',
    source: token,
    receipt_email: buyerEmail,
    description: 'Payment for the book at builderbook.org',
  });
}

exports.stripeCharge = stripeCharge;

// add session with redirect to Checkout
// apiVersion: '2020-03-02'


// const stripeInstance = new Stripe(
//   dev ? process.env.STRIPE_TEST_SECRETKEY : process.env.STRIPE_LIVE_SECRETKEY,
//   { apiVersion: '2020-03-02' },
// );