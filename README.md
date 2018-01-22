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
│   ├── HomeFooter.js           
│   ├── MenuDrop.js            
│   ├── Notifier.js            
│   ├── SharedStyles.js         
│   ├── SubscribeForm.js        
│   ├── TOC.js                  
├── lib                        
│   ├── api
│   │   ├── admin.js
│   │   ├── customer.js	
│   │   ├── getRootURL.js	
│   │   ├── public.js	
│   │   ├── sendRequest.js
│   ├── context.js
│   ├── notifier.js
│   ├── withAuth.js	
│   ├── withLayout.js
├── pages                       
│   ├── admin                  
│   │   ├── add-book.js         
│   │   ├── add-tutorial.js     
│   │   ├── book-detail.js      
│   │   ├── edit-book.js        
│   │   ├── index.js            
│   ├── customer                
│   │   ├── my-books.js         
│   ├── public                  
│   │   ├── login.js            
│   │   ├── read-chapter.js     
│   │   ├── read-tutorial.js    
│   │   ├── terms.js            
│   │   ├── tutorials.js        
│   ├── _document.js           
│   ├── index.js                
├── server                      
│   ├── api                     
│   │   ├── admin.js            
│   │   ├── customer.js         
│   │   ├── index.js            
│   │   ├── public.js           
│   ├── models                  
│   │   ├── Book.js	
│   │   ├── Chapter.js	
│   │   ├── EmailTemplate.js	
│   │   ├── Purchase.js	
│   │   ├── Tutorial.js
│   │   ├── User.js
│   ├── utils                  
│   │   ├──sanitizeHtml.js
│   │   ├──slugify.js
│   ├── app.js                   
│   ├── aws.js                  
│   ├── github.js                
│   ├── google.js                   
│   ├── logs.js                   
│   ├── mailchimp.js                 
│   ├── routesWithSlug.js              
│   ├── stripe.js                 
├── static                      
│   ├── nprogress.css
├── test/server/utils           
│   ├── slugify.test.js
├── .babelrc                    
├── .eslintrc.js
├── .gitignore
├── env-config.js
├── now.json
├── package.json
├── tos.md
├── yarn.lock

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
