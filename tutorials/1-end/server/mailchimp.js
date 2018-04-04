import request from 'request';

export async function subscribe({ email }) {
  const data = {
    email_address: email,
    status: 'subscribed',
  };

  const LIST_ID = 'xxxxxx';
  const API_KEY = 'xxxxxx';

  await new Promise((resolve, reject) => {
    request.post(
      {
        uri: `https://us17.api.mailchimp.com/3.0/lists/${LIST_ID}/members/`,
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

