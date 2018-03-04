import stripe from 'stripe';

const SIMULATE_CHARGE_FAILED = !!process.env.SIMULATE_CHARGE_FAILED;

export function charge({
  amount, token, buyerEmail,
}) {
  const dev = process.env.NODE_ENV !== 'production';
  const API_KEY = dev ? process.env.Stripe_Test_SecretKey : process.env.Stripe_Live_SecretKey;
  const client = stripe(API_KEY);

  return client.charges.create({
    amount,
    currency: 'usd',
    source: SIMULATE_CHARGE_FAILED ? 'tok_chargeDeclined' : token,
    receipt_email: buyerEmail,
    description: 'Payment for the book at builderbook.org',
  });
}
