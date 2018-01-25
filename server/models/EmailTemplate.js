import mongoose from 'mongoose';
import Handlebars from 'handlebars';

const EmailTemplate = mongoose.model('EmailTemplate', {
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

function insertTemplates() {
  const templates = [
    {
      name: 'welcome',
      subject: 'Welcome to builderbook.org',
      message: `{{userName}},
        <p>
          Thank you for signing up for Builder Book!
        </p>
        <p>
          In our books, we teach you how to build production-ready web apps from scratch.
        </p>
        <p>
          The code for our books will always be free and open source. 
        </p>
      
        Kelly & Timur, Team Builder Book
      `,
    },
    {
      name: 'purchase',
      subject: 'You purchased "{{bookTitle}}" at builderbook.org',
      message: `{{userName}},
        <p>
          Thank you for purchasing our book!
        </p>
        <p>
          Start reading your book: <a href="{{bookUrl}}" target="_blank">{{bookTitle}}</a>
        </p>
        <p>
          If you have any questions while reading the book, 
          please fill out an issue on 
          <a href="https://github.com/builderbook/builderbook target="blank">Gihub</a>.
        </p>
      
        Kelly & Timur, Team Builder Book
      `,
    },
    {
      name: 'preorder',
      subject: 'You pre-ordered "{{bookTitle}}" at builderbook.org',
      message: `{{userName}},
        <p>
          Thank you for pre-ordering our book! You just saved $20.
        </p>
        <p>
          Start reading your book: <a href="{{bookUrl}}" target="_blank">{{bookTitle}}</a>
        </p>
        <p>
          We will email you once we add each new chapter.
        </p>
        <p>
          If you have any questions while reading the book, 
          please fill out an issue on 
          <a href="https://github.com/builderbook/builderbook target="blank">Gihub</a>.
        </p>
      
        Kelly & Timur, Team Builder Book
      `,
    },
  ];

  templates.forEach(async (t) => {
    if ((await EmailTemplate.find({ name: t.name }).count()) > 0) {
      return;
    }

    EmailTemplate.create(Object.assign({}, t, { message: t.message.replace(/\n/g, '').replace(/[ ]+/g, ' ') })).catch(() => {
      // just pass error
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
