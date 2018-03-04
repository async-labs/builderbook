import request from 'request';
import crypto from 'crypto';

require('dotenv').config();

const LIST_IDS = {
  purchased: process.env.MAILCHIMP_PURCHASED_LIST_ID,
};

function callAPI({ path, method, data }) {
  const ROOT_URI = `https://${process.env.MAILCHIMP_REGION}.api.mailchimp.com/3.0`;

  const API_KEY = process.env.MAILCHIMP_API_KEY;

  return new Promise((resolve, reject) => {
    request(
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

async function getMemberDetail({ email, listName }) {
  const hash = crypto.createHash('md5');

  const path = `/lists/${LIST_IDS[listName]}/members/${hash.update(email).digest('hex')}`;

  const res = await callAPI({ path, method: 'GET' });

  return res;
}

export async function subscribe({ email, listName }) {
  const data = {
    email_address: email,
    status: 'subscribed',
  };

  const path = `/lists/${LIST_IDS[listName]}/members/`;

  let res = await callAPI({ path, method: 'POST', data });
  if (res.id) {
    return;
  }

  res = await getMemberDetail({ email, listName });

  const hash = crypto.createHash('md5');

  await callAPI({
    path: `${path}${hash.update(email).digest('hex')}`,
    method: 'PUT',
    data,
  });
}

