## Builder Book
[![apm](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/builderbook/builderbook/blob/master/LICENSE.md)
[![apm](https://img.shields.io/badge/PRs-welcome-green.svg)](https://github.com/builderbook/builderbook#contributing)

Builder Book is an open source web app built with React/Material-UI/Next/Express/Mongoose/MongoDB.

- To see a book hosted with this app: https://builderbook.org/books/builder-book/introduction
- To create your own book (Admin demo): https://demo1.builderbook.org/login


## How can you use this app?
- as a boilerplate for React/Material-UI/Next/Express/Mongoose/MongoDB stack;
- as learning material for third-party APIs such as Google, Github, AWS SES, Mailchimp, Stripe;
- as a production-ready web app:
  - write content, e.g. documentation, on Github but display the content on a web app;
  - write a book with markdown and sell it on your own website


## Contents
- [Admin demo](#admin-demo)
- [Screenshots](#screenshots)
- [Run locally](#run-locally)
- [Create your first book](#create-your-first-book)
- [Deploy](#deploy)
- [Built with](#built-with)
  - [Core stack](#core-stack)
  - [Third party APIs](#third-party-apis)
- [Project structure](#project-structure)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)


## Admin demo
- Log in with Google. You'll be logged in as an Admin (book author): [link](https://demo1.builderbook.org/login).

  - View the introduction chapter _without_ Buy button: [link](https://demo1.builderbook.org/books/test-book/introduction).

  - View Chapter-1 _with_ Buy button: [link](https://demo1.builderbook.org/books/test-book/connecting-to-database).

- After logging in, you can connect Github and create a book:
  
  - Click the `Add book` button

  - Enter book details and select a Github repo with an `introduction.md` file at the root. 
  Your `introduction.md` file must have metadata. Copy [this file](https://github.com/builderbook/demo-book/blob/master/introduction.md) as an example.
  
  - Click `Save`, then click the book's title in your dashboard.

  - You are now on the book's detail page, click the `Sync with Github` button.

  - Refresh the page and click `Introduction` to see the chapter's content.



## Run locally
- Clone the project and run `yarn` to add packages.
- Before you start the app, create a `.env` file at the app's root. This file must have _at least three env variables_: `MONGO_URL_TEST`, `Google_clientID`, `Google_clientSecret`. We recommend free MongoDB at mLab.

  To use all features and third-party integrations (such as Stripe, Google OAuth, Mailchimp), add values to all env variables in `.env` file:
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

  For Google OAuth app, callback URL is: http://localhost:8000/oauth2callback
  
  For Github OAuth app, callback URL is: http://localhost:8000/auth/github/callback


- Before you start the app, create a `env-config.js` file at the app's root. This file makes Stripe's public keys (keys that start with `pk`) available on client. Content of this file:
  `env-config.js` :
  ```
  const dev = process.env.NODE_ENV !== 'production';

  module.exports = {
    StripePublishableKey: dev
      ? 'pk_test_XXXXXX'
      : 'pk_live_XXXXXX',
  };
  ```
- Start the app with `yarn dev`.

- The _first registered user_ in the app becomes an Admin user (`"isAdmin": true`).


## Create your first book
- Create a new Github repo (public or private)

- In that repo, create an `introduction.md` file.

- Your `introduction.md` file must have metadata. Copy [this file](https://github.com/builderbook/demo-book/blob/master/introduction.md) as an example.

- Go to the app, click "Connect Github".

- Click "Add Book".


## Deploy
- Install now: `npm install -g now`

- Point your domain to Zeit world nameservers: [three steps](https://zeit.co/world#get-started)

- Check the `now.json` file. If you are using `dotenv` and `.env` for env variables, no need to change `now.json`. If you make changes to the app, check up how to [configure now](https://zeit.co/docs/features/configuration).

- Make sure you updated `ROOT_URL` in `package.json` and `lib/getRootURL.js`.

- Check that you have all production-level env variables in `.env`. 

- In your terminal, deploy the app by running `now`.

- Now outputs your deployment's URL, for example: `builderbook-zomcvzgtvc.now.sh`.

- Point successful deployment to your domain, for example: `now ln builderbook-demo-zomcvzgtvc.now.sh builderbook.org`.


## Screenshots
Chapter excerpt with Buy Button for Pubilc/Guest visitor:
![builderbook-public-readchapter](https://user-images.githubusercontent.com/26158226/35484937-d9595078-040c-11e8-97d9-d5ff47f5ac58.png)

Chapter content for book Customer:
![builderbook-customer-readchapter](https://user-images.githubusercontent.com/26158226/35484940-db47cdb0-040c-11e8-9f8b-029eb536a74d.png)

Add-book/Edit-book page for Admin user:
![builderbook-admin-editbook](https://user-images.githubusercontent.com/26158226/35486364-d64300d6-0421-11e8-8bcd-088c73fabcf7.png)

Book-detail page for Admin user:
![builderbook-admin-bookdetails](https://user-images.githubusercontent.com/26158226/35486362-d3f25390-0421-11e8-9e26-7bdaee573e1d.png)


## Built with

#### Core stack
- [React](https://github.com/facebook/react)
- [Material-UI](https://github.com/mui-org/material-ui)
- [Next](https://github.com/zeit/next.js)
- [Express](https://github.com/expressjs/express)
- [Mongoose](https://github.com/Automattic/mongoose)
- [MongoDB](https://github.com/mongodb/mongo)

#### Third party APIs
- AWS SES
- Github
- Google OAuth
- Stripe
- MailChimp

Check out [package.json](https://github.com/builderbook/builderbook/blob/master/package.json).


## Project structure

```
.
├── components                  # React components
│   ├── admin                   # Components used on Admin pages
│   │   ├── EditBook.js         # Edit title, price, and repo of book
│   │   ├── GiveFreeBook.js     # Give free book to user
│   ├── customer                # Components used on Customer pages
│   │   ├── Bookmark.js         # Bookmark a section within a book chapter
│   │   ├── BuyButton.js        # Buy book
│   ├── Header.js               # Header component
│   ├── HomeFooter.js           # Footer component on homepage
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
│   ├── withAuth.js             # HOC that passes user to pages and more
│   ├── withLayout.js           # HOC for SSR with Material-UI and more
├── pages                       # Pages
│   ├── admin                   # Admin pages
│   │   ├── add-book.js         # Page to add a new book
│   │   ├── book-detail.js      # Page to view book details and sync content with Github
│   │   ├── edit-book.js        # Page to update title, price, and repo of book
│   │   ├── index.js            # Main Admin page that has all books and more
│   ├── customer                # Customer pages
│   │   ├── my-books.js         # Customer's dashboard
│   ├── public                  # Public pages (accessible to logged out users)
│   │   ├── login.js            # Login page
│   │   ├── read-chapter.js     # Page with chapter's content
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
├── test/server/utils           # Tests
│   ├── slugify.test.js         # Unit test for generateSlug() function
├── .babelrc                    # Config for Babel
├── .eslintrc.js                # Config for Eslint
├── .gitignore                  # List of ignored files and directories
├── env-config.js               # Make Stripe's public keys available on client
├── now.json                    # Settings for now from Zeit
├── package.json                # List of packages and scripts
├── yarn.lock                   # Exact versions of packages. Generated by yarn.

```


## Contributing
We welcome suggestions and pull requests, especially for [issues](https://github.com/builderbook/builderbook/issues) labeled as "discussion" and "contributions welcome".

By participating in this project, you are expected to uphold Builder Book's [Code of Conduct](https://github.com/builderbook/builderbook/blob/master/CODE-OF-CONDUCT.md).


## Team
- [Kelly Burke](https://github.com/klyburke)
- [Delgermurun Purevkhuu](https://github.com/delgermurun)
- [Timur Zhiyentayev](https://github.com/tima101)


## License
All code in this repository is provided under the [MIT License](https://github.com/builderbook/builderbook/blob/master/LICENSE.md).
