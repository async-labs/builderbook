import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import Grid from 'material-ui/Grid';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';

import Header from '../components/HomeHeader';
import Footer from '../components/HomeFooter';
import TOC from '../components/TOC';
import BookReviews from '../components/BookReviews';

import {
  styleBigAvatar,
  styleRaisedButton,
  styleHomepageFeature,
  styleH1,
} from '../components/SharedStyles';
import withLayout from '../lib/withLayout';
import withAuth from '../lib/withAuth';
import { getTableOfContents, getBookReviews } from '../lib/api/public';

const styleAuthor = {
  textAlign: 'center',
  padding: '10px 10%',
};

const Book = ({ user, toc, reviews }) => (
  <div>
    <Head>
      <title>Learn how to build a JavaScript web app from scratch</title>
      <meta
        name="description"
        content="Learn how to build a complete web app with a modern JavaScript stack. React, Material UI, Next, Express, Mongoose, and MongoDB. Integrated with AWS SES, Github, Google OAuth, Stripe, and MailChimp."
      />
    </Head>
    <Header user={user} />
    <div style={{ padding: '10px 8%', fontSize: '15px' }}>
      <Grid container direction="row" justify="space-around" align="flex-start">
        <Grid item sm={12} xs={12} style={{ textAlign: 'center' }}>
          <br />
          <p style={{ margin: '45px auto', fontSize: '44px', fontWeight: '400' }}>Our Book</p>
          <p>
            Learn how to build a full-stack JavaScript web application from scratch.<br />
            You&apos;ll go from 0 lines of code in Chapter 1 to over 12,000 lines of code by Chapter
            8.
          </p>
          <p style={{ textAlign: 'center' }}>
            <Link
              prefetch
              as="/books/builder-book/introduction"
              href="/public/read-chapter?bookSlug=builder-book&chapterSlug=introduction"
            >
              <Button variant="raised" color="primary" style={styleRaisedButton}>
                Read Preview
              </Button>
            </Link>
            <a
              href="https://github.com/builderbook/builderbook/tree/master/book"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="raised" color="secondary" style={styleRaisedButton}>
                Book Code
              </Button>
            </a>
          </p>
        </Grid>
      </Grid>

      <h1 style={styleH1}>What You&apos;ll Learn</h1>
      <Grid container direction="row" justify="space-around" align="flex-start">
        <Grid item sm={6} xs={12} style={styleHomepageFeature}>
          <p>
            <b>Modern JavaScript stack</b>
          </p>
          <p>
            Learn how to build a web app with React, Material-UI, Next, Express, Mongoose, and
            MongoDB. We keep our book up-to-date with the latest versions.
          </p>
        </Grid>
        <Grid item sm={6} xs={12} style={styleHomepageFeature}>
          <p>
            <b>Popular third party APIs</b>
          </p>
          <p>
            Learn how to integrate a web app with Google for user authentication, Github for
            markdown and collaboration, AWS SES for transactional emails, MailChimp for newsletters,
            and Stripe for selling.
          </p>
        </Grid>
      </Grid>

      <br />

      <div>
        <BookReviews reviewsArray={reviews} numberOfReviews={8} />
      </div>

      <br />

      <div>
        <TOC toc={toc} bookSlug="builder-book" />
      </div>

      <br />

      <h1 style={styleH1}>Authors</h1>
      <div style={{ textAlign: 'center' }}>
        Together, we&apos;ve built
        <a
          href="https://github.com/builderbook/builderbook"
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}
          Builder Book
        </a>{' '}
        and
        <a href="https://findharbor.com" target="_blank" rel="noopener noreferrer">
          {' '}
          Harbor
        </a>. Stay tuned for
        <a href="https://github.com/builderbook/async" target="_blank" rel="noopener noreferrer">
          {' '}
          Async
        </a>.
      </div>
      <br />
      <Grid container direction="row" justify="space-around" align="flex-start">
        <Grid item sm={6} xs={12} style={styleAuthor}>
          <Avatar
            src="https://storage.googleapis.com/builderbook/timur-picture.png"
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
            Tima is a JavaScript web developer. He likes learning any technology that improves
            end-user experience.
          </p>
        </Grid>
        <Grid item sm={6} xs={12} style={styleAuthor}>
          <Avatar
            src="https://storage.googleapis.com/builderbook/kelly-picture.png"
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
            Kelly is a front-end developer. She likes using React and Material Design and enjoys
            solving UX problems.
          </p>
        </Grid>
      </Grid>

      <br />
    </div>
    <Footer />
  </div>
);

Book.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }),
  toc: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
  })).isRequired,
  reviews: PropTypes.arrayOf(PropTypes.object)
    .isRequired,
};

Book.defaultProps = {
  user: null,
};

Book.getInitialProps = async function getInitialProps() {
  let toc = [];
  let reviews = [];
  try {
    toc = await getTableOfContents({ slug: 'builder-book' });
  } catch (error) {
    console.log(error); // eslint-disable-line
  }
  try {
    reviews = await getBookReviews({ slug: 'builder-book' });
  } catch (error) {
    console.log(error); // eslint-disable-line
  }
  return { toc, reviews };
};

export default withAuth(withLayout(Book, { noHeader: true }), { loginRequired: false });
