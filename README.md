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
├── components                  # Application source code
│   ├── admin                   # Front-end source code
│   │   ├── EditBook.js         # Common front-end application code
│   │   ├── GiveFreeBook.js     # Common front-end application code
│   │   ├── TutorialForm.js     # Common front-end application code
│   │   ├── TutorialRepo.js     # Common front-end application code
│   ├── customer                # Common code, redux store and logging
│   │   ├── Bookmark.js         # Common front-end application code
│   │   ├── BuyButton.js        # Common front-end application code
│   ├── HomeFooter.js           # Entry point to mobile front-end wtih live code reload
│   ├── MenuDrop.js             # Entry point to mobile front-end wtih live code reload
│   ├── Notifier.js             # Entry point to mobile front-end wtih live code reload
│   ├── SharedStyles.js         # Entry point to mobile front-end wtih live code reload
│   ├── SubscribeForm.js        # Entry point to mobile front-end wtih live code reload
│   ├── TOC.js                  # Entry point to mobile front-end wtih live code reload
├── lib                         # Application source code
├── pages                       # Application source code
│   ├── admin                   # Front-end source code
│   │   ├── add-book.js         # Common front-end application code
│   │   ├── add-tutorial.js     # Common front-end application code
│   │   ├── book-detail.js      # Common front-end application code
│   │   ├── edit-book.js        # Common front-end application code
│   │   ├── index.js            # Common front-end application code
│   ├── customer                # Front-end source code
│   │   ├── my-books.js         # Common front-end application code
│   ├── public                  # Front-end source code
│   │   ├── login.js            # Common front-end application code
│   │   ├── read-chapter.js     # Common front-end application code
│   │   ├── read-tutorial.js    # Common front-end application code
│   │   ├── terms.js            # Common front-end application code
│   │   ├── tutorials.js        # Common front-end application code
│   ├── _document.js            # Front-end source code
│   ├── index.js                # Front-end source code
├── server                      # Application source code
├── static                      # Application source code
├── test/server/utils           # Application source code
├── .babelrc                    # Application source code
├── .eslintrc.js
├── .gitignore
├── env-config.js
├── now.json
├── package.json
├── tos.md
├── yarn.lock

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
