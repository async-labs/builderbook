import mongoose from 'mongoose';
import _ from 'lodash';
import logger from '../logs';

const { Schema } = mongoose;

const mongoSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const EmailTemplate = mongoose.model('EmailTemplate', mongoSchema);

function insertTemplates() {
  const templates = [
    {
      name: 'welcome',
      subject: 'Welcome to builderbook.org',
      message: `<%= userName %>,
        <p>
          At Builder Book, we are excited to help you build useful, production-ready web apps from scratch.
        </p>
        <p>
          See list of available books here.
        </p>

        Kelly & Timur,
        Team BB
      `,
    },
    {
      name: 'purchase',
      subject: 'You purchased book at builderbook.org',
      message: `<%= userName %>,
        <p>
          Thank you for purchasing our book! You will get confirmation email from Stripe shortly.
        </p>
        <p>
          Start reading your book: <a href="<%= bookUrl %>" target="_blank"><%= bookTitle %></a>
        </p>
        <p>
          If you have any questions while reading the book,
          please fill out an issue on
          <a href="https://github.com/builderbook/builderbook/issues" target="blank">Github</a>.
        </p>

        Kelly & Timur, Team Builder Book
      `,
    },
  ];

  templates.forEach(async (template) => {
    if ((await EmailTemplate.find({ name: template.name }).countDocuments()) > 0) {
      return;
    }

    EmailTemplate.create(template).catch((error) => {
      logger.error('EmailTemplate insertion error:', error);
    });
  });
}

insertTemplates();

export default async function getEmailTemplate(name, params) {
  const source = await EmailTemplate.findOne({ name });
  if (!source) {
    throw new Error(`No EmailTemplates found.
      Please check that at least one is generated at server startup,
      restart your server and try again.`);
  }

  return {
<<<<<<< HEAD
    message: _.template.compile(source.message)(params),
    subject: _.template.compile(source.subject)(params),
=======
    message: _.template(source.message)(params),
    subject: _.template(source.subject)(params),
>>>>>>> upstream/master
  };
}
