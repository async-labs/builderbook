## Open source web app (Builder Book)
[![apm](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/builderbook/builderbook/blob/master/LICENSE.md)
[![apm](https://img.shields.io/badge/PRs-welcome-green.svg)](https://github.com/builderbook/builderbook#contributing)

Builder Book is an open source web app to publish documentation or books. The app is built with React/Material-UI/Next/Express/Mongoose/MongoDB and includes these third party APIs: Google, Github, AWS SES, Mailchimp, Stripe.

- Live app: https://builderbook.org/books/builder-book/introduction.
- Learn how to build this app from scratch with [our book](https://builderbook.org/book)


## How can you use this app?
- As learning material for React/Material-UI/Next/Express/Mongoose/MongoDB stack and Google/Github/AWS SES/Mailchimp/Stripe APIs.<br> You can start from our [boilerplate](https://github.com/builderbook/builderbook/tree/master/boilerplate) or modify the final app into your own project.<br> For initial load, pages are rendered by the server; for subsequent loads, pages are rendered on the client.
- As a production-ready web app to publish documentation or sell books on your own website.


## Contents
- [Run locally](#run-locally)
- [Deploy](#deploy)
- [Add new book](#add-new-book)
- [Screenshots](#screenshots)
- [Built with](#built-with)
  - [Core stack](#core-stack)
  - [Third party APIs](#third-party-apis)
- [Project structure](#project-structure)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)


## Run locally
- Clone the project and run `yarn` to add packages.
- Before you start the app, create a `.env` file at the app's root. This file must have values for env variables specified below.
  - To get `MONGO_URL_TEST`, we recommend a [free MongoDB at mLab](http://docs.mlab.com/).
  - Get `Google_clientID` and `Google_clientSecret` by following [official OAuth tutorial](https://developers.google.com/identity/sign-in/web/sign-in#before_you_begin).

    Important: For Google OAuth app, callback URL is: http://localhost:8000/oauth2callback
    
    Important: You have to enable Google+ API in your Google Cloud Platform account.

  - Specify your own secret key for Express session `SESSION_SECRET`: https://github.com/expressjs/session#secret

  To use all features and third-party integrations (such as Stripe, Google OAuth, Mailchimp), add values to all env variables in `.env` file:

  `.env` :
  ```
  MONGO_URL="XXXXXX"
  MONGO_URL_TEST="XXXXXX"

  Google_clientID="XXXXXX"
  Google_clientSecret="XXXXXX"

  SESSION_SECRET="XXXXXX"

  Amazon_accessKeyId="XXXXXX"
  Amazon_secretAccessKey="XXXXXX"

  EMAIL_SUPPORT_FROM_ADDRESS="XXXXXX"

  Github_Test_ClientID="XXXXXX"
  Github_Test_SecretKey="XXXXXX"
  Github_Live_ClientID="XXXXXX"
  Github_Live_SecretKey="XXXXXX"


  Stripe_Test_SecretKey="XXXXXX"
  Stripe_Live_SecretKey="XXXXXX"

  Stripe_Test_PublishableKey="XXXXXX"
  Stripe_Live_PublishableKey="XXXXXX"

  MAILCHIMP_API_KEY="XXXXXX"
  MAILCHIMP_REGION="XXXXXX"
  MAILCHIMP_PREORDERED_LIST_ID="XXXXXX"
  MAILCHIMP_ORDERED_LIST_ID="XXXXXX"
  ```

- Start the app with `yarn dev`.
- The _first registered user_ in the app becomes an Admin user (`"isAdmin": true`).


## Add new book
- Create a new Github repo (public or private).
- In that repo, create an `introduction.md` file and write some content.
- At the top of your `introduction.md` file, add metadata in the format shown below. See [this file](https://github.com/builderbook/demo-book/blob/master/introduction.md) as an example.
  
  ```
  ---
  title: Introduction
  seoTitle: title for search engines
  seoDescription: description for search engines
  isFree: true
  ---
  ```

- Go to the app, click "Connect Github".
- Click "Add Book". Enter details and select the Github repo you created.
- Click "Save".

When you add new `.md` files or update content, go to the `BookDetail` page of your app and click `Sync with Github`. 

IMPORTANT: All `.md` files in your Github repo _must_ have metadata in the format shown above.

IMPORTANT: All `.md` files in your Github repo _must_ have name `introduction.md` or `chapter-N.md`.

To make the content of a `.md` file _private_ (meaning a person must purchase the content to see it), remove `isFree:true`  and add `excerpt:""`. Add some excerpt content - this content is public and serves as a free preview.


## Deploy
- Install now: `npm install -g now`.
- Point your domain to Zeit world nameservers: [three steps](https://zeit.co/world#get-started).
- Check the `now.json` file. If you are using `dotenv` and `.env` for env variables, no need to change `now.json`. If you make changes to the app, check up how to [configure now](https://zeit.co/docs/features/configuration).
- Make sure you updated `ROOT_URL` in `package.json` and `lib/getRootURL.js`.
- Check that you have all production-level env variables in `.env`. 
- In your terminal, deploy the app by running `now`.
- Now outputs your deployment's URL, for example: `builderbook-zomcvzgtvc.now.sh`.
- Point successful deployment to your domain, for example: `now ln builderbook-zomcvzgtvc.now.sh builderbook.org`.


## Screenshots
Chapter excerpt with Buy Button for Pubilc/Guest visitor:
![builderbook-public-readchapter](https://user-images.githubusercontent.com/26158226/38517453-e84a7566-3bee-11e8-82cd-14b4dfbe6a78.png)

Chapter content and Table of Contents for book Customer:
![builderbook-customer-readchapter](https://user-images.githubusercontent.com/26158226/38518394-9ee97306-3bf1-11e8-8df2-8c05fb75249a.png)

Add-book/Edit-book page for Admin user:
![builderbook-admin-editbook](https://user-images.githubusercontent.com/26158226/38517449-e5faaa38-3bee-11e8-9c02-740096dc860e.png)

Book-detail page for Admin user:
![builderbook-admin-bookdetails](https://user-images.githubusercontent.com/26158226/38517450-e7005bd0-3bee-11e8-9916-81f32d3d1827.png)


## Built with

#### Core stack
- [React](https://github.com/facebook/react)
- [Material-UI](https://github.com/mui-org/material-ui)
- [Next](https://github.com/zeit/next.js)
- [Express](https://github.com/expressjs/express)
- [Mongoose](https://github.com/Automattic/mongoose)
- [MongoDB](https://github.com/mongodb/mongo)

#### Third party APIs
- Google OAuth
- Github
- AWS SES
- Stripe
- MailChimp

Check out [package.json](https://github.com/builderbook/builderbook/blob/master/package.json).


## Project structure

```
.
├── boilerplate                 # Boilerplate with React, Material-UI, Next, Express, Mongoose, MongoDB 
├── book                        # Codebases for each chapter of our book
├── components                  # React components
│   ├── admin                   # Components used on Admin pages
│   │   ├── EditBook.js         # Edit title, price, and repo of book
│   │   ├── GiveFreeBook.js     # Give free book to user
│   ├── customer                # Components used on Customer pages
│   │   ├── Bookmark.js         # Bookmark a section within a book chapter
│   │   ├── BuyButton.js        # Buy book
│   ├── BookReviews.js          # Component that outputs grid of reviews
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
│   ├── book.js                 # Book page
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
│   ├── sitemapAndRobots.js     # Express routes for sitemap.xml and robots.txt
│   ├── stripe.js               # Stripe API
├── static                      # Static resources
│   ├── robots.txt              # Rules for search engine bots
├── test/server/utils           # Tests
│   ├── slugify.test.js         # Unit test for generateSlug() function
├── .babelrc                    # Config for Babel
├── .eslintrc.js                # Config for Eslint
├── .gitignore                  # List of ignored files and directories
├── .npmignore                  # Files and directories that are not uploaded to the server
├── now.json                    # Settings for now from Zeit
├── package.json                # List of packages and scripts
├── yarn.lock                   # Exact versions of packages. Generated by yarn.

```


## Contributing
We welcome suggestions and pull requests, especially for [issues](https://github.com/builderbook/builderbook/issues) labeled as `discussion` and `contributions welcome`.

By participating in this project, you are expected to uphold Builder Book's [Code of Conduct](https://github.com/builderbook/builderbook/blob/master/CODE-OF-CONDUCT.md).


## Team
- [Kelly Burke](https://github.com/klyburke)
- [Delgermurun Purevkhuu](https://github.com/delgermurun)
- [Timur Zhiyentayev](https://github.com/tima101)


## License
All code in this repository is provided under the [MIT License](https://github.com/builderbook/builderbook/blob/master/LICENSE.md).
