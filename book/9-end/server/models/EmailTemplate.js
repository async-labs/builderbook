const mongoose = require('mongoose');
const _ = require('lodash');
const logger = require('../logger');

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

async function insertTemplates() {
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
  ];

  for (const t of templates) { // eslint-disable-line
    const et = await EmailTemplate.findOne({ name: t.name }); // eslint-disable-line

    const message = t.message.replace(/\n/g, '').replace(/[ ]+/g, ' ').trim();

    if (!et) {
      EmailTemplate.create({ ...t, message });
    } else if (et.subject !== t.subject || et.message !== message) {
      EmailTemplate.updateOne({ _id: et._id }, { $set: { message, subject: t.subject } }).exec();
    }
  }
}

async function getEmailTemplate(name, params) {
  const et = await EmailTemplate.findOne({ name });

  if (!et) {
    throw new Error(`No EmailTemplates found.`);
  }

  return {
    message: _.template(et.message)(params),
    subject: _.template(et.subject)(params),
  };
}

exports.insertTemplates = insertTemplates;
exports.getEmailTemplate = getEmailTemplate;
