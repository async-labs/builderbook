import mongoose from 'mongoose';
import Handlebars from 'handlebars';

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
      message: `{{userName}},
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

  templates.forEach(async (template) => {
    if ((await EmailTemplate.find({ name: template.name }).count()) > 0) {
      return;
    }

    EmailTemplate
      .create(template)
      .catch((error) => {
        logger.error('EmailTemplate insertion error:', error);
      });
  });
}

insertTemplates();

export default async function getEmailTemplate(name, params) {
  const source = await EmailTemplate.findOne({ name });
  if (!source) {
    throw new Error('not found');
  }

  return {
    message: Handlebars.compile(source.message)(params),
    subject: Handlebars.compile(source.subject)(params),
  };
}

