import Head from 'next/head';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import withAuth from '../../lib/withAuth';
import withLayout from '../../lib/withLayout';
import { styleLoginButton } from '../../lib/SharedStyles';

function Login({ router }) {
  const redirectUrl = (router && router.query && router.query.redirectUrl) || '';

  return (
    <div style={{ textAlign: 'center', margin: '0 20px' }}>
      <Head>
        <title>Log in to Builder Book</title>
        <meta name="description" content="Login page for builderbook.org" />
      </Head>
      <br />
      <p style={{ margin: '45px auto', fontSize: '44px', fontWeight: '400' }}>Log in</p>
      <p>You’ll be logged in for 14 days unless you log out manually.</p>
      <br />
      <Button
        variant="contained"
        style={styleLoginButton}
        href={`/auth/google?redirectUrl=${redirectUrl}`}
      >
        <img
          src="https://storage.googleapis.com/builderbook/G.svg"
          alt="Log in with Google"
          style={{ marginRight: '10px' }}
        />
        Log in with Google
      </Button>
    </div>
  );
}

Login.propTypes = {
  router: PropTypes.shape({
    query: PropTypes.shape({
      redirectUrl: PropTypes.string,
    }),
  }).isRequired,
};

export default withAuth(withLayout(withRouter(Login)), { logoutRequired: true });
