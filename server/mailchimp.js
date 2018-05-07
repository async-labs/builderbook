const request = require('request');

require('dotenv').config();

const LIST_IDS = {
  purchased: process.env.MAILCHIMP_PURCHASED_LIST_ID,
  signups: process.env.MAILCHIMP_SIGNUPS_LIST_ID,
  tutorials: process.env.MAILCHIMP_TUTORIALS_LIST_ID,
};

function callAPI({ path, method, data }) {
  const ROOT_URI = `https://${process.env.MAILCHIMP_REGION}.api.mailchimp.com/3.0`;

  const API_KEY = process.env.MAILCHIMP_API_KEY;

  return new Promise((resolve, reject) => {
    request.post(
      {
        method,
        uri: `${ROOT_URI}${path}`,
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

async function subscribe({ email, listName }) {
  const data = {
    email_address: email,
    status: 'subscribed',
  };

  const path = `/lists/${LIST_IDS[listName]}/members/`;

  await callAPI({ path, method: 'POST', data });
}

exports.subscribe = subscribe;
