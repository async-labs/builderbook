require('dotenv').config();

module.exports = {
  env: {
    StripePublishableKey: process.env.StripePublishableKey,
  },
};
