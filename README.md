## Builder Book

Open source web app to publish documentation or books.

We've used this `builderbook` project to build:
- [Async](https://async-await.com) - communication tool for small teams of software developers
- [Builder Book](https://builderbook.org) - learn how to build full-stack web apps from scratch
- [SaaS Boilerplate](https://github.com/async-labs/saas) - open source web app to build your own SaaS product

## Live app:
- https://builderbook.org/books/builder-book/introduction.

## How can you use this app?
- As learning material for React/Material-UI/Next/Express/Mongoose/MongoDB stack
- As learning material for Google/Github/AWS SES/Mailchimp/Stripe APIs.<br> 
- As starting point for your own project. Use the code in [book/1-begin](https://github.com/builderbook/builderbook/tree/master/book/1-begin) or [book/1-end](https://github.com/builderbook/builderbook/tree/master/book/1-end) as a lean boilerplate or modify the final app.<br>
- As a production-ready web app to publish documentation or sell content on your own website (we sell our own book).


## Contents
- [Showcase](#showcase)
- [Run locally](#run-locally)
- [Add a new book](#add-a-new-book)
- [Add your own styles](#add-your-own-styles)
- [Deploy](#deploy)
- [Deploy to Heroku](#deploy-to-heroku)
- [Scaling](#scaling)
- [Screenshots](#screenshots)
- [Built with](#built-with)
  - [Core stack](#core-stack)
  - [Third party APIs](#third-party-apis)
- [Docker](#docker)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)
- [Project structure](#project-structure)


## Showcase
Check out projects built with the help of this open source app. Feel free to add your own project by creating a pull request.
- [Retaino](https://retaino.com) by [Earl Lee](https://github.com/earllee) : Save, annotate, review, and share great web content. Receive smart email digests to retain key information.
- [SaaS boilerplate app](https://github.com/async-labs/saas-by-async): Open source web app that saves you weeks of work when building your own SaaS product. 
- [Harbor](https://github.com/builderbook/harbor): Open source web app that allows anyone with a Gmail account to automatically charge for advice sent via email.
- [Async](https://async-await.com/): asynchronous communication and project management tool for small teams of software engineers.


## Run locally
- Clone the project and run `yarn` to add packages.
- Before you start the app, create a `.env` file at the app's root. This file must have values for some env variables specified below.
  - To get `MONGO_URL_TEST`, we recommend a [free MongoDB at MongoDB Atlas](https://docs.mongodb.com/manual/tutorial/atlas-free-tier-setup/) (to be updated soon with MongoDB Atlas, see [issue](https://github.com/builderbook/builderbook/issues/138)).
  - Get `Google_clientID` and `Google_clientSecret` by following [official OAuth tutorial](https://developers.google.com/identity/sign-in/web/sign-in#before_you_begin).

    Important: For Google OAuth app, callback URL is: http://localhost:8000/oauth2callback <br/>
    Important: You have to enable Google+ API in your Google Cloud Platform account.

  - Specify your own secret key for Express session `SESSION_SECRET`: https://github.com/expressjs/session#secret


To use all features and third-party integrations (such as Stripe, Google OAuth, Mailchimp), add values for all of the following env variables in your `.env` file:

  `.env` :
  ```
  # Used in server/app.js
  MONGO_URL="xxxxxx"
  MONGO_URL_TEST="xxxxxx"
  SESSION_SECRET="xxxxxx"

  # Used in server/google.js
  Google_clientID="xxxxxx"
  Google_clientSecret="xxxxxx"

  # Used in server/aws.js
  Amazon_accessKeyId="xxxxxx"
  Amazon_secretAccessKey="xxxxxx"
  Amazon_region="xxxxxx"

  # Used in server/models/User.js
  EMAIL_SUPPORT_FROM_ADDRESS="xxxxxx"
  
  ----------
  # All environmental variables above this line are required for successful sign up
  
  # Used in server/github.js
  Github_Test_ClientID="xxxxxx"
  Github_Test_SecretKey="xxxxxx"
  Github_Live_ClientID="xxxxxx"
  Github_Live_SecretKey="xxxxxx"

  # Used in server/stripe.js
  Stripe_Test_SecretKey="xxxxxx"
  Stripe_Live_SecretKey="xxxxxx"

  # Used in server/mailchimp.js
  MAILCHIMP_API_KEY="xxxxxx"
  MAILCHIMP_REGION="xxxxxx"
  MAILCHIMP_SIGNUPS_LIST_ID="xxxxxx"
  MAILCHIMP_PURCHASED_LIST_ID="xxxxxx"
  MAILCHIMP_TUTORIALS_LIST_ID="xxxxxx"

  ```

- Start the app with `GA_TRACKING_ID=xxxxxx StripePublishableKey=xxxxxx yarn dev`.
  - To get `GA_TRACKING_ID`, set up Google Analytics and follow [these instructions](https://support.google.com/analytics/answer/1008080?hl=en) to find your tracking ID.
  - To get `StripePublishableKey`, set up Stripe and find your key [here](https://dashboard.stripe.com/account/apikeys).

  Env keys `GA_TRACKING_ID` and `StripePublishableKey` are universally available (client and server). Env keys inside `.env` file are used in server code only.
- The _first registered user_ in the app becomes an Admin user (user document gets parameters`"isAdmin": true`).


## Add a new book
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

Important: All `.md` files in your Github repo _must_ have metadata in the format shown above.

Important: All `.md` files in your Github repo _must_ have name `introduction.md` or `chapter-N.md`.

To make the content of a `.md` file _private_ (meaning a person must purchase the content to see it), remove `isFree:true`  and add `excerpt:""`. Add some excerpt content - this content is public and serves as a free preview.


## Add your own styles
To change the color scheme of this app, modify the `primary` and `secondary` theme colors inside `lib/context.js`. Select any colors from Material UI's official [color palette](https://material-ui-next.com/style/color/#color).

Recommended ways to add your own styles to this app:
1. [Inline style for a single element](#inline-style-for-a-single-element)
2. [Reusable style for multiple elements within single page or component](#reusable-style-for-multiple-elements-within-single-page-or-component)
3. [Reusable/importable style for multiple pages or components](#reusableimportable-style-for-multiple-pages-or-components)
4. [Global style for all pages in application](#global-style-for-all-pages-in-application)


### Inline style for a single element
USE CASE: apply a style to _one element_ on a single page/component <br>
For example, in our `book` page, we wrote this single inline style:
```
<p style={{ textAlign: 'center' }}>
  ...
</p>
```
[See usage](https://github.com/builderbook/builderbook/blob/49116676e0894fcf00c33d208a284359b30f12bb/pages/book.js#L48)


### Reusable style for multiple elements within single page or component
USE CASE: apply the same style to _multiple elements_ on a single page/component.<br>
For example, in our `tutorials` page, we created `styleExcerpt` and applied it to a `<p>` element within the page:

```
const styleExcerpt = {
  margin: '0px 20px',
  opacity: '0.75',
  fontSize: '13px',
};

<p style={styleExcerpt}>
  ...
</p>

```
[See usage](https://github.com/builderbook/builderbook/blob/49116676e0894fcf00c33d208a284359b30f12bb/pages/tutorials.js#L14)


### Reusable/importable style for multiple pages or components
USE CASE: apply the same style to elements on _multiple pages/components_.<br>
For example, we created `styleH1` inside `components/SharedStyles.js` and exported the style at the bottom of the file:
```
const styleH1 = {
  textAlign: 'center',
  fontWeight: '400',
  lineHeight: '45px',
};

module.exports = {
  styleH1,
};
```
[See usage](https://github.com/builderbook/builderbook/blob/04c6cf78bee42455d48ef3466d868f2196381a57/components/SharedStyles.js#L48)

We then imported `styleH1` into our `book` page, as well as our `index` page, and applied the style to a `<h1>` element:
```
import {
  styleH1,
} from '../components/SharedStyles';

<h1 style={styleH1}>
  ...
</h1>
```
[See usage](https://github.com/builderbook/builderbook/blob/49116676e0894fcf00c33d208a284359b30f12bb/pages/book.js#L13)


### Global style for all pages in application
USE CASE: apply the same style to elements on _all pages_ of your app.<br>
Create your style in `pages/_document.js`. For example, we specified a style for all hyperlinks that use the `<a>` element:
```
<style>
  {`
    a, a:focus {
      font-weight: 400;
      color: #1565C0;
      text-decoration: none;
      outline: none
    }
  `}
</style>
```
[See usage](https://github.com/builderbook/builderbook/blob/49116676e0894fcf00c33d208a284359b30f12bb/pages/_document.js#L51)

We also specified styles for all content inside a `<body>` element:
```
<body
  style={{
    font: '16px Muli',
    color: '#222',
    margin: '0px auto',
    fontWeight: '400',
    lineHeight: '1.5em',
    backgroundColor: '#F7F9FC',
  }}
>
</body>
```
[See usage](https://github.com/builderbook/builderbook/blob/49116676e0894fcf00c33d208a284359b30f12bb/pages/_document.js#L96)


## Deploy

IMPORTANT: Now v1 is depreciated for new users. See the next section about deploying to Heroku.

- Install now: `npm install -g now`.
- Point your domain to Zeit world nameservers: [three steps](https://zeit.co/world#get-started).
- Create `now.json` file. Make sure to add actual values for `GA_TRACKING_ID`, `StripePublishableKey` (production-level) and `alias`. Read more about how to [configure now](https://zeit.co/docs/features/configuration).
```
{
  "version": 1
  "env": {
    "NODE_ENV": "production",
    "GA_TRACKING_ID": "xxxxxx",
    "StripePublishableKey": "xxxxxx"
  },
  "dotenv": true
  "alias": "mydomain.com",
  "scale": {
    "sfo1": {
      "min": 1,
      "max": 1
    }
  }
}
```
- Make sure you updated `ROOT_URL` value in `package.json` and `lib/getRootURL.js`.
- Check that you have all production-level env variables in `.env`. 
- In your terminal, deploy the app by running `now`.
- Now outputs your deployment's URL, for example: `builderbook-zomcvzgtvc.now.sh`.
- Point successful deployment to your domain with `now alias` or `now ln NOW_URL mydomain.com` (`NOW_URL` is URL of your deployment).

## Deploy to Heroku

In this section we will learn how to deploy our app to [Heroku cloud](https://www.heroku.com/home). We will deploy our React-Next-Express app to lightweight Heroku container called [dyno](https://www.heroku.com/dynos).

Instructions are for app located at `/book/8-end`.
Adjust route if you are deploying app from the root of this public repo.

We will discuss the following topics in this section:
1. installing Heroku on Linux-based OS
2. creating app on Heroku dashboard
3. preparing app for deployment
4. configuring env variables
5. deploying app
6. checking logs
7. adding custom domain

Let's go step by step.

1. Install Heroku CLI (command-line interface) on your OS. Follow the [official guide](https://devcenter.heroku.com/articles/heroku-cli). In this book we provide instructions for Linux-based systems, in particular, a Ubuntu OS. For Ubuntu OS, run in your terminal:
  <pre>sudo snap install --classic heroku</pre>
  To confirm a successful installation, run:
  <pre>heroku --version</pre>
  As example, my output that confirms successful installation, looks like:
  <pre>heroku/7.22.7 linux-x64 node-v11.10.1</pre>

2. [Sign up](https://signup.heroku.com/) for Heroku, go to your Heroku dashboard and click purple <b>New</b> button on the right:
  ![image](https://user-images.githubusercontent.com/10218864/54558094-12b1f100-497a-11e9-94dd-d36399052931.png)

    On the next screen, give a name to your app and select a region. Click purple <b>Create app</b> button at the bottom:
    ![image](https://user-images.githubusercontent.com/10218864/54558276-8eac3900-497a-11e9-9026-25aa5047af87.png)

    You will be redirected to `Deploy` tab of your newly created Heroku app:
    ![image](https://user-images.githubusercontent.com/10218864/54558544-417c9700-497b-11e9-8885-6fdfde21c747.png)

3. As you can see from the above screenshot, you have two options. You can deploy the app directly from your local machine using Heroku CLI or directly from GitHub.
    In this tutorial, we will deploy a `builderbook/builderbook/book/8-end` app from our public [builderbook/builderbook](https://github.com/builderbook/builderbook) repo hosted on GitHub. Deploying from a private repo will be a similar process.
    
    Deploying from GitHub has a few advantages. Heroku uses git to track changes in a codebase. It's possible to deploy app from the local machine using Heroku CLI, however you have to create a [Git repo](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository) for `builderbook/builderbook/book/8-end` with `package.json` file at the root level. A first advantage is that we can deploy from a non-root folder using GitHub instead of Heroku CLI.
    
    A second advantage is automation, later on you can create a branch that automatically deploy every new commit to Heroku. For example, we have a [deploy branch](https://github.com/async-labs/saas/tree/deploy) for our demo for [SaaS boilerplate](https://github.com/async-labs/saas/). When we commit to `master` branch - there is no new deployment, when we commit to `deploy` branch - new change is automatically deployed to Heroku app.

    Let's set up deploying from GitHub. On `Deploy` tab of your Heroku app at Heroku dashboard, click <b>Connect to GitHub</b>, then search for your repo, then click <b>Connect</b> next to the name of the proper repo:
    ![image](https://user-images.githubusercontent.com/10218864/54560210-09775300-497f-11e9-9027-2e3850ec7ff1.png)

    If successful, you will see green text `Connected` and be offered to select a branch and deploy app automatically or manually. Automatic deployment will deploy every new commit, manual deployment requires you to manually click on <b>Deploy Branch</b> button. For simplicity, we will deploy manually from `master` branch of our `builderbook/builderbook` repo.

    Before we perform a manual deployment via GitHub, we need Heroku to run some additional code while app is being deploying. Firstly, we need to tell Heroku that `8-end` app in the `builderbook/builderbook` repo is not at the root level, it's actually nested at `/book/8-end`. Secondly, Heroku needs to know that our app is Node.js app so Heroku finds `package.json` file, properly installs dependencies and runs proper scripts (such as `build` and `start` scripts from `package.json`). To achieve this, we need to add so called `buildpacks` to our Heroku app. Click `Settings` tab, scroll to `Buildpacks` section and click purple <b>Add buildpack</b> button:
    ![image](https://user-images.githubusercontent.com/10218864/54561192-50fede80-4981-11e9-976a-c3d7c88527ec.png)

    Add two buildpacks, first is `https://github.com/timanovsky/subdir-heroku-buildpack` and second is `heroku/nodejs`:
    ![image](https://user-images.githubusercontent.com/10218864/54561577-30835400-4982-11e9-997f-4711d999808e.png)

    Next, scroll up while on `Settings` tab and click purple <b>Reveal Config Vars</b> button, create a new environmental variable `PROJECT_PATH` with value `book/8-end`:
    ![image](https://user-images.githubusercontent.com/10218864/54561775-a5568e00-4982-11e9-9561-2e5827873779.png)

    The above variable will be used by the first buildpack `subdir-heroku-buildpack` to deploy app from repo's subdirectory.

4. If we deploy app at this point, our app will deploy with errors since we did not add environmental variables. Similar to how you added `PROJECT_PATH` variable, add all environmental variables from `book/8-end/.env` file to your Heroku app. Remember to add:
  - `MONGO_URL`,
  - `Google_clientID`, 
  - `Google_clientSecret`,
  - `EMAIL_SUPPORT_FROM_ADDRESS`,
  - `Github_Test_ClientID`,
  - `Github_Test_SecretKey`,
  - `Github_Live_ClientID`,
  - `Github_Live_SecretKey`,
  - `Stripe_Test_SecretKey`,
  - `Stripe_Live_SecretKey`,
  - `MAILCHIMP_API_KEY`,
  - `MAILCHIMP_PURCHASED_LIST_ID`,
  - `SESSION_SECRET`.


5. While on `Settings` tab, scroll to `Domains and certificates` section and note your app's URL. My app's URL is: https://builderbook-8-end.herokuapp.com
    Let's deploy, go to `Deploy` tab, scroll to `Manual deploy` section and click <b>Deploy branch</b> button.
    After deployment process is complete , navigate to your app's URL:
    ![image](https://user-images.githubusercontent.com/10218864/54564053-10569380-4988-11e9-87dd-f81a28dd6406.png)

6. Server logs are not available on Heroku dashboard. To see logs, you have to use Heroku CLI.
    In your terminal, run:
    <pre>heroku login</pre>

    Follow instructions to log in to Heroku CLI.

    After successful login, terminal will print:
    <pre>Logged in as email@domain.com</pre>

    Where `email@domain.com` is an email address that you used to create your Heroku account.

    To see logs, in your terminal run:
    <pre>heroku logs --app builderbook-8-end --tail</pre>

    In your terminal, you will see your most recent logs and be able to see a real-time logs. 

    You can output certain number of lines (N) for retrieved logs by adding `--num N` to the `heroku logs` command.
    You can print only app's logs by adding `--source app` or system's logs by adding `--source heroku`.  

7. Time to add a custom domain. The Heroku app that we created is deployed on `free dyno`. Free dyno plan does not let you to add a custom domain to your app. To add custom domain, go to `Resources` tab and click purple <b>Change Dyno Type</b> button:
    ![image](https://user-images.githubusercontent.com/10218864/54622849-983faa80-4a27-11e9-957f-54fe5aa742ca.png)

    Select a `Hobby` plan and click <b>Save</b> button.

    Navigate to `Settings` tab and scroll to the `Domains and certificates` and click purple <b>Add domain</b> button:
    ![image](https://user-images.githubusercontent.com/10218864/54623152-36cc0b80-4a28-11e9-974b-8a14fb56a86a.png)

    Type your custom domain name, I added `heroku.builderbook.org` as a custom domain, click <b>Save changes</b> button.

    Heroku will displa you a value for CNAME record that you have to create for your custom domain. For me, custom domain is `heroku.builderbook.org and I manage DNS records at Now by Zeit.
    
    After you create a CNAME, ACM status on Heroku's dashboard will change to `Ok`:
    ![image](https://user-images.githubusercontent.com/10218864/54624195-2452d180-4a2a-11e9-999d-a6a771cde73c.png)

It's important that you remember to manually add your custom domain to the settings of your Google OAuth app (Chapter 3) and GitHub OAuth app (Chapter 6). If you forget to do it, you will see errors when you try to log in to your app or when you try to connect GitHub to your app.

## Scaling

You may want to consider splitting single Next/Express server into two servers:
- Next server for serving pages, server-side caching, sitemap and robots
- Express server for internal and external APIs

Here is an example of web application with split servers:
https://github.com/async-labs/saas

Splitting servers will get you:
- faster page loads since Next rendering does not block internal and external APIs,
- faster code reload times during development,
- faster deployment and more flexible scaling of individual apps.


## Screenshots
Chapter excerpt with Buy Button for Public/Guest visitor:
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

## Docker
- Install Docker and Docker Compose
- Modify `docker-compose-dev.yml` file
- If using Ubuntu, follow these steps: https://stackoverflow.com/questions/38775954/sudo-docker-compose-command-not-found
- Start app with `docker-compose -f docker-compose-dev.yml up`

## Contributing
We welcome suggestions and pull requests, especially for [issues](https://github.com/builderbook/builderbook/issues) labeled as `discussion` and `contributions welcome`.

By participating in this project, you are expected to uphold Builder Book's [Code of Conduct](https://github.com/builderbook/builderbook/blob/master/CODE-OF-CONDUCT.md).

Want to support this project? Sign up at [async](https://async-await.com) and/or buy our [books](https://builderbook.org), which teach you how to build web apps from scratch. Also check out our open source [SaaS boilerplate](https://github.com/async-labs/saas).


## Team
- [Kelly Burke](https://github.com/klyburke)
- [Delgermurun Purevkhuu](https://github.com/delgermurun)
- [Timur Zhiyentayev](https://github.com/tima101)

You can contact us at team@builderbook.org

If you want to hire us to add custom features on top of our [SaaS boilerplate](https://github.com/async-labs/saas), please fill out our [form](https://builderbook.org/custom-saas-boilerplate).

## License
All code in this repository is provided under the [MIT License](https://github.com/builderbook/builderbook/blob/master/LICENSE.md).


## Project structure

```
.
├── book                                # Codebases for each chapter of our book
├── components                          # React components
│   ├── admin                           # Components used on Admin pages
│   │   ├── EditBook.js                 # Edit title, price, and repo of book
│   │   ├── GiveFreeBook.js             # Give free book to user
│   ├── customer                        # Components used on Customer pages
│   │   ├── Bookmark.js                 # Bookmark a section within a book chapter
│   │   ├── BuyButton.js                # Buy book
│   ├── BookReviews.js                  # Component that outputs grid of reviews
│   ├── Header.js                       # Header component
│   ├── HomeFooter.js                   # Footer component on homepage
│   ├── HomeHeader.js                   # Header component on homepage
│   ├── MenuDrop.js                     # Dropdown menu
│   ├── Notifier.js                     # In-app notifications for app's users
│   ├── SubscribeForm.js                # Form to subscribe to MailChimp newsletter
│   ├── TOC.js                          # Table of Contents
├── lib                                 # Code available on both client and server
│   ├── api                             # Client-side API methods
│   │   ├── admin.js                    # Admin user methods
│   │   ├── customer.js	                # Customer user methods
│   │   ├── getRootURL.js               # Returns ROOT_URL
│   │   ├── public.js                   # Public user methods
│   │   ├── sendRequest.js              # Reusable code for all GET and POST requests
│   ├── SharedStyles.js                 # List of _reusable_ styles
│   ├── context.js                      # Context for Material-UI integration
│   ├── env.js                          # Universal config for environmental variables
│   ├── gtag.js                         # Universal config for Google Analytics
│   ├── notifier.js                     # Contains notify() function that loads Notifier component
│   ├── withAuth.js                     # HOC that passes user to pages and more
│   ├── withLayout.js                   # HOC for SSR with Material-UI and more
├── pages                               # Pages
│   ├── admin                           # Admin pages
│   │   ├── add-book.js                 # Page to add a new book
│   │   ├── book-detail.js              # Page to view book details and sync content with Github
│   │   ├── edit-book.js                # Page to update title, price, and repo of book
│   │   ├── index.js                    # Main Admin page that has all books and more
│   ├── customer                        # Customer pages
│   │   ├── my-books.js                 # Customer's dashboard
│   ├── public                          # Public pages (accessible to logged out users)
│   │   ├── login.js                    # Login page
│   │   ├── read-chapter.js             # Page with chapter's content
│   ├── _document.js                    # Allows to customize pages (feature of Next.js)
│   ├── book.js                         # Book page
│   ├── index.js                        # Homepage
│   ├── tutorials.js                    # Tutorials page
├── server                              # Server code
│   ├── api                             # Express routes, route-level middleware
│   │   ├── admin.js                    # Admin routes
│   │   ├── customer.js                 # Customer routes
│   │   ├── index.js                    # Mounts all Express routes on server
│   │   ├── public.js                   # Public routes
│   │   ├── sync-all-inside-fork.js     # Sync all book chapters in forked process
│   │   ├── sync-one-inside-fork.js     # Sync single book chapter in forked process
│   ├── models                          # Mongoose models
│   │   ├── Book.js                     # Book model
│   │   ├── Chapter.js	                # Chapter model
│   │   ├── EmailTemplate.js            # Email Template model
│   │   ├── Purchase.js                 # Purchase model
│   │   ├── Review.js                   # Book Reviews model
│   │   ├── Tutorial.js                 # Tutorial model
│   │   ├── User.js                     # User model
│   ├── utils                           # Server-side util
│   │   ├──slugify.js                   # Generates slug for any Model
│   ├── app.js                          # Custom Express/Next server
│   ├── aws.js                          # AWS SES API
│   ├── github.js                       # Github API
│   ├── google.js                       # Google OAuth API
│   ├── logs.js                         # Logger
│   ├── mailchimp.js                    # MailChimp API
│   ├── routesWithCache.js              # Express routes with cache
│   ├── routesWithSlug.js               # Express routes that contain slug
│   ├── sitemapAndRobots.js             # Express routes for sitemap.xml and robots.txt
│   ├── stripe.js                       # Stripe API
├── static                              # Static resources
│   ├── robots.txt                      # Rules for search engine bots
├── test/server/utils                   # Tests
│   ├── slugify.test.js                 # Unit test for generateSlug() function
├── tutorials                           # Codebases for our tutorials
├── .eslintrc.js                        # Config for Eslint
├── .gitignore                          # List of ignored files and directories
├── .npmignore                          # Files and directories that are not uploaded to the server
├── now.json                            # Settings for now from Zeit
├── package.json                        # List of packages and scripts
├── yarn.lock                           # Exact versions of packages. Generated by yarn.

```
