import request from 'request';

require('dotenv').config();

export async function subscribe({ email }) {
  const data = {
    email_address: email,
    status: 'subscribed',
  };

  const LIST_IDS = process.env.MAILCHIMP_PURCHASED_LIST_ID;

  const API_KEY = process.env.MAILCHIMP_API_KEY;

  await new Promise((resolve, reject) => {
    request.post(
      {
        uri: `https://us17.api.mailchimp.com/3.0/lists/${LIST_IDS}/members/`,
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${Buffer.from(`apikey:${API_KEY}`).toString('base64')}`,
        },
        json: true,
        body: data,
      },
      (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(body);
        }
      },
    );
  });
}

