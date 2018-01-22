# Builder Book

[![apm](https://img.shields.io/apm/l/vim-mode.svg)]()

Open source web app to write and sell technical books or publish documentation.

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
├── components                  # Reusable React components
│   ├── admin                   # Components accessible to Admin user only
│   │   ├── EditBook.js         # Edit name, price, and repo of books
│   │   ├── GiveFreeBook.js     # Give free book via email
│   │   ├── TutorialForm.js     # Collect subscribers for tutorials
│   │   ├── TutorialRepo.js     # Connect tutorials to github repo
│   ├── customer                # Components accesible to Customer user only
│   │   ├── Bookmark.js         # Bookmark a section within a book chapter
│   │   ├── BuyButton.js        # Buy book after login
│   ├── Header.js               # Header component
│   ├── HomeFooter.js           # Footer component on homepage
│   ├── HomeHeader.js           # Header component on homepage
│   ├── MenuDrop.js             # Login/Logout menu in header
│   ├── Notifier.js             # In-app notifications to users
│   ├── SharedStyles.js         # List of styles reused in the app
│   ├── TOC.js                  # Table of Contents for books
├── lib                         # Reusable code available on both client and server
│   ├── api                     # Client-side API methods
│   │   ├── admin.js            # Admin user API endpoints
│   │   ├── customer.js	        # Customer user API endpoints
│   │   ├── getRootURL.js	      # 
│   │   ├── public.js	          # Public/Guest user API endpoints
│   │   ├── sendRequest.js      # Send request and extract data from URLs
│   ├── context.js              # Create app context
│   ├── notifier.js             # Functions for Notifier component
│   ├── withAuth.js             # Higher-order component to show pages according to login status
│   ├── withLayout.js           # Higher-order component wrapping Index page
├── pages                       # All web pages in this app
│   ├── admin                   # Pages accessible to Admin user only
│   │   ├── add-book.js         # Page to add a new book
│   │   ├── book-detail.js      # Page to view book chapters and sync with Github
│   │   ├── edit-book.js        # Page to update price, title, and repo of book
│   │   ├── index.js            # 
│   ├── customer                # Pages accessible to Customer user only
│   │   ├── my-books.js         # Dashboard to view all purchased and available books
│   ├── public                  # Pages accessible to logged-out Guest users
│   │   ├── login.js            # Login page
│   │   ├── read-chapter.js     # Pages to view chapter content (preview for Guest; full content for Customer)
│   │   ├── terms.js            # Terms of Service page
│   ├── _document.js            # Override some default features of Next.js
│   ├── index.js                # Homepage
├── server                      # Server code
│   ├── api                     # Internal APIs
│   │   ├── admin.js            # Admin user API endpoints
│   │   ├── customer.js         # Customer user API endpoints
│   │   ├── index.js            # Express base routes
│   │   ├── public.js           # Public/Guest user API endpoints
│   ├── models                  # Mongoose models
│   │   ├── Book.js             # Model to create and modify books
│   │   ├── Chapter.js	        # Model to create and modify chapters inside books
│   │   ├── EmailTemplate.js    # Model to create and modify transactional email templates
│   │   ├── Purchase.js	        # 
│   │   ├── User.js             # Model to create and modify users
│   ├── utils                   # Sever utilities
│   │   ├──sanitizeHtml.js      # Select desired HTML tags and attributes
│   │   ├──slugify.js           # Create slugs
│   ├── app.js                  # Create Express server
│   ├── aws.js                  # Integration with AWS SES API
│   ├── github.js               # Integration with Github API
│   ├── google.js               # Integration with Google API
│   ├── logs.js                 # Debugging and logging with Winston
│   ├── mailchimp.js            # Integration with MailChimp API
│   ├── routesWithSlug.js       # routesWithSlug.js
│   ├── stripe.js               # Integration with Stripe API
├── static                      # Static methods
│   ├── nprogress.css           # Page loading bar
├── test/server/utils           # Tests for server code
│   ├── slugify.test.js         # Test proper slug creation
├── .babelrc                    # Transpiler for JavaScript
├── .eslintrc.js                # Linting utility for JavaScript
├── .gitignore                  # Files to ignore
├── env-config.js               # Set environment variables
├── now.json                    # Configure deployment with Now
├── package.json                # All packages in this app
├── tos.md                      # Text for Terms of Service
├── yarn.lock                   # Versions of each dependency installed

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

Submit an [issue](https://github.com/builderbook/builderbook-app/issues/new) to report bugs or suggest improvements to this web app. Please follow the issue template.

By participating in this project, you are expected to uphold Builder Book's [Code of Conduct](https://github.com/builderbook/builderbook-app/blob/master/CODE-OF-CONDUCT.md).

## Team

- [Timur Zhiyentayev](https://github.com/tima101)
- [Kelly Burke](https://github.com/klyburke)
- [Delgermurun Purevkhuu](https://github.com/delgermurun)

## License

All code in this repository is provided under the [MIT License](https://github.com/builderbook/builderbook-app/blob/master/LICENSE.md).
