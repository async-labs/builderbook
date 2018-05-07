const mongoose = require('mongoose');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  bookSlug: {
    type: String,
    required: true,
  },
  tutorials: [
    {
      title: {
        type: String,
        required: true,
      },
      excerpt: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
      domain: {
        type: String,
        required: true,
      },
      order: {
        type: Number,
        required: true,
        unique: true,
      },
    },
  ],
});

const Tutorial = mongoose.model('Tutorial', mongoSchema);

async function insertTutorialDocument() {
  const tutorial = {
    bookSlug: 'builder-book',
    tutorials: [
      {
        title: 'How to integrate MailChimp in a JavaScript web app',
        order: 3,
        excerpt:
          'If you are a blogger, publisher, or business owner who does content marketing, having a newsletter is a must. In this tutorial, you will learn how to add Mailchimp integration to a simple JavaScript app...',
        domain: 'freecodecamp.com',
        link:
          'https://medium.freecodecamp.org/how-to-integrate-mailchimp-in-a-javascript-web-app-2a889fb43f6f',
      },
      {
        title: 'Add transactional emails to a JavaScript web app (React, Express) with AWS SES',
        order: 2,
        excerpt:
          'Sending transactional emails is a basic feature of modern web applications. Apps send emails for various reasons. A simple app may send only a welcome email to a newly registered user...',
        domain: 'codeburst.io',
        link:
          'https://codeburst.io/add-transactional-emails-to-a-javascript-web-app-react-express-9fa1ff2e40e0',
      },
      {
        title: 'Server-side vs client-side rendering in React apps',
        order: 1,
        excerpt:
          'In this tutorial, we will take a deeper look at the two types of rendering for web apps: server-side and client-side. I will walk you through basic setup, testing, and comparison of two pages...',
        domain: 'hackernoon.com',
        link:
          'https://hackernoon.com/server-side-vs-client-side-rendering-in-react-apps-443efd6f2e87',
      },
    ],
  };

  const count = await Tutorial.findOne({ bookSlug: 'builder-book' }).count();

  if (count === 0) {
    Tutorial.create(Object.assign({}, tutorial));
  }
}

insertTutorialDocument();

module.exports = Tutorial;
