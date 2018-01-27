# Builder Book

[![apm](https://img.shields.io/apm/l/vim-mode.svg)]()

Open source web app to write and sell books or publish free content, for example, documentation.


### Demo

Log in as Admin (book author): [link](https://demo1.builderbook.org/login).

Introduction chapter _without_ Buy button: [link](https://demo1.builderbook.org/books/test/introduction).

Chapter-1 _with_ Buy button: [link](https://demo1.builderbook.org/books/test/connecting-to-database).

After logging in, you can connect Github and create a book:
- click `Add book` button,
- create book, select Github repo with a non-empty `introduction.md` file at the root
- on dashboard, click book's title
- you are now on book's detail page, click `Sync with Github` button
- refresh page and click `Introduction` link to see the chapter's content


## Contents
- [Run locally](#run-locally)
- [Deploy](#deploy)
- [Built with](#built-with)
  - [Tech stack](#tech-stack)
  - [Third party APIs](#third-party-apis)
- [Features](#features)
- [Project structure](#project-structure)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)


## Run locally
- Clone project and run `yarn` to add packages.
- Before you start app, create `.env` file at app's root. This file must have _at least three env variable_, `MONGO_URL_TEST`, `Google_clientID`, `Google_clientSecret`. We recommend free MongoDB at mLab.

  To use all features and third-party integrations (such as Stripe, Google OAuth, Mailchimp and etc), add values to all env variables in `.env` file:
  `.env` :
  ```
  MONGO_URL="XXXXXX"
  MONGO_URL_TEST="XXXXXX"

  Google_clientID="XXXXXX"
  Google_clientSecret="XXXXXX"

  Amazon_accessKeyId="XXXXXX"
  Amazon_secretAccessKey="XXXXXX"

  EMAIL_SUPPORT_FROM_ADDRESS="XXXXXX"

  Github_Test_ClientID="XXXXXX"
  Github_Test_SecretKey="XXXXXX"
  Github_Live_ClientID="XXXXXX"
  Github_Live_SecretKey="XXXXXX"


  Stripe_Test_SecretKey="XXXXXX"
  Stripe_Live_SecretKey="XXXXXX"

  MAILCHIMP_API_KEY="XXXXXX"
  MAILCHIMP_REGION="XXXXXX"
  MAILCHIMP_PREORDERED_LIST_ID="XXXXXX"
  MAILCHIMP_ORDERED_LIST_ID="XXXXXX"
  ```

- Before you start app, create `env-config.js` file at app' root. It's purpose is to make Stripe's public keys (keys that start with `pk`) available on client. Content of this file:
  `env-config.js` :
  ```
  const dev = process.env.NODE_ENV !== 'production';

  module.exports = {
    StripePublishableKey: dev
      ? 'pk_test_XXXXXX'
      : 'pk_live_XXXXXX',
  };
  ```
- Start app with `yarn dev`.

- _First registered user_ in the app becomes Admin user (`"isAdmin": true`).


## Deploy
Follow below steps to deploy Builder Book app with Zeit's [now](https://zeit.co/now).

1. Install now: `npm install -g now`

2. Point your domain to Zeit world nameservers: [three steps](https://zeit.co/world#get-started)

3. Check up `now.json` file. If you are using `dotenv` and `.env` for env variables, no need to change `now.json` file. If you changes to app, check up how to [configure now](https://zeit.co/docs/features/configuration).

4. Make sure you updated `ROOT_URL` in `package.json` and `lib/getRootURL.js` files.

5. Check that you have all production-level env variable in `.env`. In your terminal, deploy app by running `now`.

5. Now outputs your deployment's URL, for example: `builderbook-zomcvzgtvc.now.sh`.

6. Point successful deployment to your domain, for example: `now ln builderbook-demo-zomcvzgtvc.now.sh builderbook.org`.

You are done.


## Built with

### Core stack
- React
- Material-UI
- Next
- Express
- Mongoose
- MongoDB

### Third party APIs
- AWS SES
- Github
- Google OAuth
- Stripe
- MailChimp

Check out [package.json](https://github.com/builderbook/builderbook/blob/master/package.json).


## Features

- **Use Github as your CMS**</br>
Write blog posts, documentation, and books with Markdown. Write directly on Github or your favorite code editor.

- **Deploy in under 5 min**</br>
Quickly deploy to your own domain using [Zeit Now](https://zeit.co/now).

- **Transactional Emails**</br>
Integrated with AWS SES to send customized transactional emails to subscribers and customers.

- **Newsletters via MailChimp**</br>
Integrated with MailChimp to create mailing lists for different types of subscribers and customers.

- **Option to Sell Books with Stripe**</br>
Integrated with Stripe to create a simple checkout for book customers.

- **MIT License**</br>
This web app is free and open source under the MIT License.

## Project structure

```
.
├── components                  # React components
│   ├── admin                   # Components used on Admin pages
│   │   ├── EditBook.js         # Edit name, price, and repo of book
│   │   ├── GiveFreeBook.js     # Give free book to user
│   │   ├── TutorialForm.js     # Subscribe to newsletter form
│   │   ├── TutorialRepo.js     # Select Github repo for Tutorials
│   ├── customer                # Components used on Customer pages
│   │   ├── Bookmark.js         # Bookmark a section within a book chapter
│   │   ├── BuyButton.js        # Buy book
│   ├── Header.js               # Header component
│   ├── HomeFooter.js           # Footer component for Homepage
│   ├── HomeHeader.js           # Header component on homepage
│   ├── MenuDrop.js             # Dropdown menu
│   ├── Notifier.js             # In-app notifications for app's users
│   ├── SharedStyles.js         # List of _reusable_ styles
│   ├── TOC.js                  # Table of Contents
├── lib                         # Code available on both client and server
│   ├── api                     # Client-side API methods
│   │   ├── admin.js            # Admin user methods
│   │   ├── customer.js	        # Customer user methods
│   │   ├── getRootURL.js       # Returns ROOT_URL
│   │   ├── public.js           # Public user methods
│   │   ├── sendRequest.js      # Reusable code for all GET and POST requests
│   ├── context.js              # Context for Material-UI integration
│   ├── notifier.js             # Contains notify() function that loads Notifier component
│   ├── withAuth.js             # HOC, passes user to pages and more
│   ├── withLayout.js           # HOC for SSR with Material-UI and more
├── pages                       # Pages
│   ├── admin                   # Admin pages
│   │   ├── add-book.js         # Page to add a new book
│   │   ├── book-detail.js      # Page to view book details and sync content with Github
│   │   ├── edit-book.js        # Page to update price, title, and repo of book
│   │   ├── index.js            # Main Admin's page that has all books and more
│   ├── customer                # Customer pages
│   │   ├── my-books.js         # Customer's dashboard
│   ├── public                  # Public pages (accessible to logged out users)
│   │   ├── login.js            # Login page
│   │   ├── read-chapter.js     # Page with chapter's content
│   │   ├── terms.js            # Terms of Service page
│   ├── _document.js            # Allows to customize pages (feature of Next.js)
│   ├── index.js                # Homepage
├── server                      # Server code
│   ├── api                     # Express routes, route-level middleware
│   │   ├── admin.js            # Admin routes
│   │   ├── customer.js         # Customer routes
│   │   ├── index.js            # Mounts all Express routes on server
│   │   ├── public.js           # Public routes
│   ├── models                  # Mongoose models
│   │   ├── Book.js             # Book model
│   │   ├── Chapter.js	        # Chapter model
│   │   ├── EmailTemplate.js    # Email Template model
│   │   ├── Purchase.js	        # Purchase model
│   │   ├── User.js             # User model
│   ├── utils                   # Server-side util
│   │   ├──sanitizeHtml.js      # Sanitizes HTML
│   │   ├──slugify.js           # Generates slug for any Model
│   ├── app.js                  # Custom Express/Next server
│   ├── aws.js                  # AWS SES API
│   ├── github.js               # Github API
│   ├── google.js               # Google OAuth API
│   ├── logs.js                 # Logger
│   ├── mailchimp.js            # MailChimp API
│   ├── routesWithSlug.js       # Express routes that contain slug
│   ├── stripe.js               # Stripe API
├── static                      # Static resources
│   ├── nprogress.css           # Styles for Nprogress
├── test/server/utils           # Tests
│   ├── slugify.test.js         # Unit test for generateSlug() function
├── .babelrc                    # Config for Babel
├── .eslintrc.js                # Config for Eslint
├── .gitignore                  # List of ignored files and directories
├── env-config.js               # Make Stripe's public keys available on client
├── now.json                    # Settings for now from Zeit
├── package.json                # List of packages and scripts
├── tos.md                      # Content from Terms of Service
├── yarn.lock                   # exact versions of packages

```

## Contributing

Submit an [issue](https://github.com/builderbook/builderbook/issues/new) to report bugs or suggest improvements to this web app. Please follow the issue template.

By participating in this project, you are expected to uphold Builder Book's [Code of Conduct](https://github.com/builderbook/builderbook/blob/master/CODE-OF-CONDUCT.md).

## Team

- [Timur Zhiyentayev](https://github.com/tima101)
- [Kelly Burke](https://github.com/klyburke)
- [Delgermurun Purevkhuu](https://github.com/delgermurun)

## License

All code in this repository is provided under the [MIT License](https://github.com/builderbook/builderbook/blob/master/LICENSE.md).
