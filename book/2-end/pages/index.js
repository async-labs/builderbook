import PropTypes from 'prop-types';

import Head from 'next/head';

const Index = ({ user }) => (
  <div style={{ padding: '10px 45px' }}>
    <Head>
      <title>Index page</title>
      <meta name="description" content="This is an SEO description of the Index page" />
    </Head>
    <p>Content on Index page</p>
    <p>
      Email:&nbsp;
      {user.email}
    </p>
  </div>
);

Index.getInitialProps = async ({ query }) => ({ user: query.user });

Index.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string.isRequired,
  }),
};

Index.defaultProps = {
  user: null,
};

export default Index;
