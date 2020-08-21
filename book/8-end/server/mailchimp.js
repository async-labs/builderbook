const request = require('request');

require('dotenv').config();

async function subscribe({ email }) {
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

exports.subscribe = subscribe;



// import fetch, { Response } from 'node-fetch';

// const LIST_IDS = {
//   signups: process.env.MAILCHIMP_SAAS_ALL_LIST_ID,
// };

// function callAPI({ path, method, data }): Promise<Response> {
//   const ROOT_URI = `https://${process.env.MAILCHIMP_REGION}.api.mailchimp.com/3.0`;

//   return fetch(`${ROOT_URI}${path}`, {
//     method,
//     headers: {
//       Accept: 'application/json',
//       Authorization: `Basic ${Buffer.from(`apikey:${process.env.MAILCHIMP_API_KEY}`).toString(
//         'base64',
//       )}`,
//     },
//     body: JSON.stringify(data),
//   });
// }

// async function addToMailchimp({ email, listName }) {
//   const data = {
//     // eslint-disable-next-line
//     email_address: email,
//     status: 'subscribed',
//   };

//   const path = `/lists/${LIST_IDS[listName]}/members/`;

//   await callAPI({ path, method: 'POST', data });
// }

// export { addToMailchimp };
