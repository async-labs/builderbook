import PropTypes from 'prop-types';

import Head from 'next/head';

const propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string.isRequired,
  }),
};

const defaultProps = {
  user: null,
};

const Index = ({ user }) => (
  <div style={{ padding: '10px 45px' }}>
    <Head>
      <title>Dashboard</title>
      <meta name="description" content="This is a description of the Index page" />
    </Head>
    <p>Content on Index page</p>
    <p>
      Email:&nbsp;
      {user.email}
    </p>
  </div>
);

Index.getInitialProps = async (ctx) => ({ user: ctx.query.user });

Index.propTypes = propTypes;
Index.defaultProps = defaultProps;

export default Index;
