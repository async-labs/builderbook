import PropTypes from 'prop-types';
import Head from 'next/head';

import Header from '../components/HomeHeader';
import Footer from '../components/HomeFooter';
import SubscribeForm from '../components/SubscribeForm';

import withLayout from '../lib/withLayout';
import withAuth from '../lib/withAuth';
import { getTutorials } from '../lib/api/public';

import { styleH1 } from '../components/SharedStyles';

const styleExcerpt = {
  margin: '0px 20px',
  opacity: '0.75',
  fontSize: '13px',
};

function renderTutorials(tutorialItem) {
  return (
    <li style={{ padding: '20px 0px' }} key={tutorialItem.order}>
      <a href={tutorialItem.link} target="_blank">
        {tutorialItem.title}
      </a>{' '}
      <span style={{ fontSize: '12px', fontWeight: '400' }}>({tutorialItem.domain})</span>
      <p style={styleExcerpt}>{tutorialItem.excerpt}</p>
    </li>
  );
}

const Tutorials = ({ user, tutorials }) => (
  <div>
    <Head>
      <title>Tutorials at builderbook.org</title>
      <meta
        name="description"
        content="Practical tutorials on JavaScript, React, Next, Express, Mongoose, MongoDB, Node."
      />
    </Head>
    <Header user={user} />
    <div style={{ padding: '10px 18%', fontSize: '15px' }}>
      <br />
      <h1 style={styleH1}>Our tutorials</h1>
      <p style={{ margin: '0px 20px', textAlign: 'center' }}>Get notified about new tutorials:</p>
      <SubscribeForm />
      {tutorials && tutorials.length > 0 ? (
        <div style={{ margin: '20px 0px 400px 0px' }}>
          {tutorials.map(tutorialItem => renderTutorials(tutorialItem))}
        </div>
      ) : null}
      <br />
    </div>
    <Footer />
  </div>
);

Tutorials.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }),
  tutorials: PropTypes.arrayOf(PropTypes.shape({}))
    .isRequired,
};

Tutorials.defaultProps = {
  user: null,
};

Tutorials.getInitialProps = async function getInitialProps() {
  let tutorials;
  try {
    tutorials = await getTutorials({ slug: 'builder-book' });
  } catch (error) {
    console.log(error); // eslint-disable-line
  }
  return { tutorials };
};

export default withAuth(withLayout(Tutorials, { noHeader: true }), { loginRequired: false });
