import PropTypes from 'prop-types';
import Head from 'next/head';
import Grid from 'material-ui/Grid';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import Hidden from 'material-ui/Hidden';

import Header from '../components/HomeHeader';
import Footer from '../components/HomeFooter';
import TOC from '../components/TOC';

import { styleGrid, styleBigAvatar, styleRaisedButton } from '../components/SharedStyles';
import withLayout from '../lib/withLayout';
import withAuth from '../lib/withAuth';
import { getTableOfContents } from '../lib/api/public';

const Index = ({ user, toc }) => (
  <div>
    <Head>
      <title>Open source web app to write a blog, publish documentation, or sell books</title>
      <meta
        name="description"
        content="Free and open source (MIT License) web app for developers to write a blog, publish documentation, or write and sell a book. Built with React, Material UI, Next.js, Express (Node.js), MongoDB, and more. Integrated with AWS SES, Github, Google OAuth (Passport.js), Stripe, and MailChimp."
      />
    </Head>
    <Header user={user} />
    <div style={{ padding: '10px 45px' }}>
      <Grid style={styleGrid} container direction="row" justify="space-around" align="flex-start">
        <Grid item sm={12} xs={12} style={{ textAlign: 'center' }}>
          <h1 style={{ margin: '45px auto', fontSize: '44px', fontWeight: '400' }}>Builder Book</h1>
          <p>Open source web app to write a blog, publish documentation, or sell a book.</p>
          <p style={{ textAlign: 'center' }}>
            <a
              href="https://github.com/builderbook/builderbook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button raised color="secondary" style={styleRaisedButton}>
                See Code
              </Button>
            </a>
            <a
              href="https://builderbook.org/books/builder-book/introduction"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button raised color="primary" style={styleRaisedButton}>
                Live App
              </Button>
            </a>
          </p>
          <p>
            <b>Built with:</b> React, Material-UI, Next.js, Express (Node.js), MongoDB. See
            <a
              href="https://github.com/builderbook/builderbook/blob/master/package.json"
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
              package.json
            </a>.
          </p>
          <p>
            <b>Third party APIs:</b> AWS SES, Github, Google OAuth (Passport.js), Stripe, MailChimp.
          </p>
        </Grid>
      </Grid>

      <br />

      <h1
        style={{
          textAlign: 'center',
          fontWeight: '400',
          fontSize: '36px',
          lineHeight: '45px',
        }}
      >
        How can I use this project?
      </h1>
      <Grid style={styleGrid} container direction="row" justify="space-around" align="flex-start">
        <Grid item sm={4} xs={12} style={{ textAlign: 'center' }}>
          <p>
            <b> Create a personal website and blog </b>
          </p>
          <p> Write and share blog posts, get subscribers, and send them newsletters.</p>
        </Grid>
        <Grid item sm={4} xs={12} style={{ textAlign: 'center' }}>
          <p>
            <b> Publish documentation </b>
          </p>
          <p> Write project documentation with Markdown and host it all on Github.</p>
        </Grid>
        <Grid item sm={4} xs={12} style={{ textAlign: 'center' }}>
          <p>
            <b> Write and sell books </b>
          </p>
          <p>
            Write and host books on Github, then sell them directly from your website.
          </p>
          <div style={{ display: 'none' }}>
            <a
              href="https://builderbook.org/books/builder-book/introduction"
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
              Our book
            </a>{' '}
            is built with this app.
          </div>
        </Grid>
      </Grid>

      <br />

      <h1
        style={{
          textAlign: 'center',
          fontWeight: '400',
          fontSize: '36px',
          lineHeight: '45px',
        }}
      >
        Features
      </h1>
      <Grid style={styleGrid} container direction="row" justify="space-around" align="flex-start">
        <Grid item sm={4} xs={12} style={{ textAlign: 'center' }}>
          <p>
            <b> Use Github as your CMS </b>
          </p>
          <p>
            Write blogs, documentation, and books with Markdown. Write directly on Github or your
            favorite code editor.
          </p>
        </Grid>
        <Grid item sm={4} xs={12} style={{ textAlign: 'center' }}>
          <p>
            <b> Deploy in under 5 min </b>
          </p>
          <p>
            <a
              href="https://github.com/builderbook/builderbook#run-locally"
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
              Quickly deploy
            </a>{' '}
            to your own domain using Zeit Now.
          </p>
        </Grid>
        <Grid item sm={4} xs={12} style={{ textAlign: 'center' }}>
          <p>
            <b> MIT License </b>
          </p>
          <p>
            This web app is free and open source under the
            <a
              href="https://github.com/builderbook/builderbook/blob/master/LICENSE.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
              MIT License
            </a>.
          </p>
        </Grid>
        <Grid item sm={4} xs={12} style={{ textAlign: 'center' }}>
          <p>
            <b> Transactional Emails </b>
          </p>
          <p>
            Integrated with AWS SES to send customized transactional emails to subscribers and
            customers.
          </p>
        </Grid>
        <Grid item sm={4} xs={12} style={{ textAlign: 'center' }}>
          <p>
            <b> Newsletters via MailChimp </b>
          </p>
          <p>
            Integrated with MailChimp to create mailing lists for different types of subscribers and
            customers.
          </p>
        </Grid>
        <Grid item sm={4} xs={12} style={{ textAlign: 'center' }}>
          <p>
            <b> Option to Sell Books with Stripe </b>
          </p>
          <p> Integrated with Stripe to create a simple checkout for book customers. </p>
        </Grid>
      </Grid>

      <br />
      <div style={{ display: 'none' }}>
        <h1
          style={{
          textAlign: 'center',
          fontWeight: '400',
          fontSize: '36px',
          lineHeight: '45px',
        }}
        >
          The Book
        </h1>
        <p style={{ textAlign: 'center' }}>
        Our project is free and open source. If you want to support it and learn how we built this
        app, order
          <a
            href="https://builderbook.org/books/builder-book/introduction"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
          our book
          </a>.
        </p>
        <p style={{ textAlign: 'center' }}>
        In the book, we teach you how to build this web app from scratch - with complete
          <a
            href="https://github.com/builderbook/builderbook/book"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
          codebases
          </a>{' '}
        for every chapter.
        </p>
        <p style={{ textAlign: 'center' }}>
          <a
            href="https://builderbook.org/books/builder-book/introduction"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button raised color="primary" style={styleRaisedButton}>
            Read the Introduction
            </Button>
          </a>
          <a
            href="https://builderbook.org/books/builder-book/introduction"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button raised color="primary" style={styleRaisedButton}>
            Pre-order for $29
            </Button>
          </a>
        </p>

        <Hidden only="xs">
          <TOC toc={toc} bookSlug="builder-book" />
          <br />

          <h1
            style={{
            textAlign: 'center',
            fontWeight: '400',
            fontSize: '36px',
            lineHeight: '45px',
          }}
          >
          Book Pre-requisites
          </h1>
          <p style={{ textAlign: 'center' }}>
          Our book is ideal for junior developers who want to learn how to build a web app from
          scratch.
          </p>
          <p style={{ textAlign: 'center' }}>
          You should know fundamentals of HTML, CSS, and JavaScript. Experience with React is
          helpful but not a must-have.
          </p>
        </Hidden>

        <br />
      </div>

      <h1
        style={{
          textAlign: 'center',
          fontWeight: '400',
          fontSize: '36px',
          lineHeight: '45px',
        }}
      >
        The Team
      </h1>
      <div style={{ textAlign: 'center' }}>
        Together, we've built production-ready web apps and reached thousands of users:
        <a href="https://getdrizzle.com" target="_blank" rel="noopener noreferrer">
          {' '}
          Drizzle
        </a>,
        <a href="https://findharbor.com" target="_blank" rel="noopener noreferrer">
          {' '}
          Harbor
        </a>,
        <a href="https://builderbook.org" target="_blank" rel="noopener noreferrer">
          {' '}
          Builder Book
        </a>.
      </div>
      <br />
      <Grid
        style={{ styleGrid }}
        container
        direction="row"
        justify="space-around"
        align="flex-start"
      >
        <Grid item sm={4} xs={12} style={{ textAlign: 'center', padding: '10px 45px' }}>
          <Avatar
            src="https://storage.googleapis.com/builderbook-homepage/timur-picture.png"
            style={styleBigAvatar}
            alt="Timur Zhiyentayev"
          />
          <p>
            <a href="https://github.com/tima101" target="_blank" rel="noopener noreferrer">
              Timur Zhiyentayev
            </a>
            <br />
            Vancouver, WA
          </p>
          <p>
            Tima is a full-stack web developer. He enjoys learning Javascript frameworks and building useful web
            apps.
          </p>
        </Grid>
        <Grid item sm={4} xs={12} style={{ textAlign: 'center', padding: '10px 45px' }}>
          <Avatar
            src="https://storage.googleapis.com/builderbook-homepage/kelly-picture.png"
            style={styleBigAvatar}
            alt="Kelly Burke"
          />
          <p>
            <a href="https://github.com/klyburke" target="_blank" rel="noopener noreferrer">
              Kelly Burke
            </a>
            <br />
            Vancouver, WA
          </p>
          <p>
            Kelly is front-end developer. She likes React and enjoys solving UX problems in web apps.
          </p>
        </Grid>
        <Grid item sm={4} xs={12} style={{ textAlign: 'center', padding: '10px 45px' }}>
          <Avatar
            src="https://storage.googleapis.com/builderbook-homepage/delgermurun-picture.png"
            style={styleBigAvatar}
            alt="Delgermurun Purevkhuu"
          />
          <p>
            <a href="https://github.com/delgermurun" target="_blank" rel="noopener noreferrer">
              Delgermurun Purevkhuu
            </a>
            <br />
            Ulaanbaatar, Mongolia
          </p>
          <p>
            Del is a back-end developer. He built many production-ready web apps with Javascript and Python.
          </p>
        </Grid>
      </Grid>

      <br />

      <h1
        style={{
          textAlign: 'center',
          fontWeight: '400',
          fontSize: '36px',
          lineHeight: '45px',
        }}
      >
        In case you're wondering...
      </h1>
      <Grid
        style={{ styleGrid, margin: '0px 0px 30px 0px' }}
        container
        direction="row"
        justify="space-around"
        align="flex-start"
      >
        <Grid item sm={4} xs={12} style={{ textAlign: 'center' }}>
          <p>
            <b> How do I start using this web app? </b>
          </p>
          <p>
            See
            <a
              href="https://github.com/builderbook/builderbook#run-locally"
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
              our instructions
            </a>{' '}
            on Github to install the code, run it locally, and deploy it to a live site.
          </p>
        </Grid>
        <Grid item sm={4} xs={12} style={{ textAlign: 'center' }}>
          <p>
            <b> Do you keep your web app up-to-date? </b>
          </p>
          <p>
            Yes, we use the latest versions of all frameworks, libraries, and services. We regularly
            check for updates.
          </p>
        </Grid>
        <Grid item sm={4} xs={12} style={{ textAlign: 'center' }}>
          <p>
            <b> What if I get stuck or have questions? </b>
          </p>
          <p>
            <a
              href="https://github.com/builderbook/builderbook/issues/new"
              target="_blank"
              rel="noopener noreferrer"
            >
              Submit an issue
            </a>{' '}
            to report bugs, ask questions, or make suggestions about this project or our book.
          </p>
        </Grid>
        <Grid item sm={4} xs={12} style={{ textAlign: 'center', display: 'none' }}>
          <p>
            <b> Do you provide sample code in your book? </b>
          </p>
          <p>
            Yes, we divided the entire web app into
            <a
              href="https://github.com/builderbook/builderbook/book"
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
              codebases
            </a>{' '}
            for each chapter of our book.
          </p>
        </Grid>
        <Grid item sm={4} xs={12} style={{ textAlign: 'center', display: 'none' }}>
          <p>
            <b> Do you provide a free preview of your book? </b>
          </p>
          <p>
            The
            <a
              href="https://builderbook.org/books/builder-book/introduction"
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
              introduction
            </a>{' '}
            and an excerpt at the beginning of every chapter are available to read for free.
          </p>
        </Grid>
        <Grid item sm={4} xs={12} style={{ textAlign: 'center', display: 'none' }}>
          <p>
            <b> Can I get a free copy of your book? </b>
          </p>
          <p>
            {' '}
            As Techstars founders (Atlanta '16), we're giving back by offering a free copy to other
            Techstars founders.
            <a href="mailto:team@rbuilderbook.org"> Email us</a> your name, company, and Techstars
            batch.
          </p>
        </Grid>
      </Grid>
      <br />
    </div>
    <Footer />
  </div>
);

Index.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }),
  toc: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
  })).isRequired,
};

Index.defaultProps = {
  user: null,
};

Index.getInitialProps = async function getInitialProps() {
  let toc = [];
  try {
    toc = await getTableOfContents({ slug: 'builder-book' });
  } catch (error) {
    // pass
  }

  return { toc };
};

export default withAuth(withLayout(Index, { noHeader: true }), { loginRequired: false });
