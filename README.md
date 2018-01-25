# Builder Book

[![apm](https://img.shields.io/apm/l/vim-mode.svg)]()

Open source web app to write and sell books or publish free content, for example, documentation.

Check out [demo](https://demo1.builderbook.org).

## Contents
- [Built With](#built-with)
  - [Tech Stack](#tech-stack)
  - [Third Party APIs](#third-party-apis)
- [Project Structure](#project-structure)
- [Features](#features)
- [Installation](#installation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)

## Built With

### Tech Stack
- React
- Material-UI
- Next.js
- Express (Node.js)
- Mongoose
- MongoDB

### Third Party APIs
- AWS SES
- Github
- Google OAuth (Passport.js)
- Stripe
- MailChimp

Check out [package.json](https://github.com/builderbook/builderbook/blob/master/package.json).

## Project Structure

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

## Installation

Follow these instructions to download all packages and run a copy of the app on your local machine.

## Deployment

Follow these instructions to deploy the app to a live site.

## Contributing

Submit an [issue](https://github.com/builderbook/builderbook/issues/new) to report bugs or suggest improvements to this web app. Please follow the issue template.

By participating in this project, you are expected to uphold Builder Book's [Code of Conduct](https://github.com/builderbook/builderbook/blob/master/CODE-OF-CONDUCT.md).

## Team

- [Timur Zhiyentayev](https://github.com/tima101)
- [Kelly Burke](https://github.com/klyburke)
- [Delgermurun Purevkhuu](https://github.com/delgermurun)

## License

All code in this repository is provided under the [MIT License](https://github.com/builderbook/builderbook/blob/master/LICENSE.md).
