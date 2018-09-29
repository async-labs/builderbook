import Head from 'next/head';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import withAuth from '../../lib/withAuth';
import withLayout from '../../lib/withLayout';
import { styleLoginButton } from '../../components/SharedStyles';

function Login({ url }) {
  const redirectUrl = (url.query && url.query.redirectUrl) || '';

  return (
    <div style={{ textAlign: 'center', margin: '0 20px' }}>
      <Head>
        <title>
          Log in to Builder Book
        </title>
        <meta name="description" content="Login page for builderbook.org" />
      </Head>
      <br />
      <p style={{ margin: '45px auto', fontSize: '44px', fontWeight: '400' }}>
        Log in
      </p>
      <p>
        You’ll be logged in for 14 days unless you log out manually.
      </p>
      <br />
      <Button
        variant="raised"
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
  url: PropTypes.shape({
    query: PropTypes.shape({
      redirectUrl: PropTypes.string,
    }),
  }).isRequired,
};

export default withAuth(withLayout(Login), { logoutRequired: true });
