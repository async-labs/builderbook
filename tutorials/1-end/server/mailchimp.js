import request from 'request';

export async function subscribe({ email }) {
  const data = {
    email_address: email,
    status: 'subscribed',
  };

  const listId = 'fc4171c626';
  const API_KEY = 'c82d5b7241e88d04f74705eaaeeb6fe7-us17';
  // these are non-functional keys
  // get your own keys at Mailchimp

  await new Promise((resolve, reject) => {
    request.post(
      {
        uri: `https://us17.api.mailchimp.com/3.0/lists/${listId}/members/`,
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

