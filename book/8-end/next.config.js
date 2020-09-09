require('dotenv').config();

module.exports = {
  env: {
    Stripe_Test_PublishableKey: process.env.Stripe_Test_PublishableKey,
    Stripe_Live_PublishableKey: process.env.Stripe_Live_PublishableKey,
    GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
  },
};
