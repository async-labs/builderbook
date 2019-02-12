import PropTypes from 'prop-types';
import Link from 'next/link';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

import MenuDrop from './MenuDrop';

import { styleToolbar, styleRaisedButton } from '../lib/SharedStyles';

const optionsMenuCustomer = [
  {
    text: 'My books',
    href: '/customer/my-books',
    as: '/my-books',
  },
  {
    text: 'Log out',
    href: '/logout',
    noPrefetch: true,
  },
];

const optionsMenuAdmin = [
  {
    text: 'Admin',
    href: '/admin',
  },
  {
    text: 'Log out',
    href: '/logout',
    noPrefetch: true,
  },
];

function Header({ user, hideHeader, next }) {
  return (
    <div
      style={{
        overflow: 'hidden',
        position: 'relative',
        display: 'block',
        top: hideHeader ? '-64px' : '0px',
        transition: 'top 0.5s ease-in',
      }}
    >
      <Toolbar style={styleToolbar}>
        <Grid container direction="row" justify="space-around" alignItems="center">
          <Grid item sm={6} xs={1} style={{ textAlign: 'left' }}>
            {!user ? (
              <Link prefetch href="/">
                <Avatar
                  src="https://storage.googleapis.com/builderbook/logo.svg"
                  alt="Builder Book logo"
                  style={{ margin: '0px auto 0px 10px', cursor: 'pointer' }}
                />
              </Link>
            ) : null}
          </Grid>
          <Grid item sm={2} xs={2} style={{ textAlign: 'right' }}>
            {user && user.isAdmin && !user.isGithubConnected ? (
              <Hidden smDown>
                <a href="/auth/github">
                  <Button variant="contained" color="primary" style={styleRaisedButton}>
                    Connect Github
                  </Button>
                </a>
              </Hidden>
            ) : null}
          </Grid>
          <Grid item sm={4} xs={9} style={{ textAlign: 'right' }}>
            {user ? (
              <div style={{ whiteSpace: ' nowrap' }}>
                {!user.isAdmin ? (
                  <MenuDrop
                    options={optionsMenuCustomer}
                    src={user.avatarUrl}
                    alt={user.displayName}
                  />
                ) : null}
                {user.isAdmin ? (
                  <MenuDrop
                    options={optionsMenuAdmin}
                    src={user.avatarUrl}
                    alt={user.displayName}
                  />
                ) : null}
              </div>
            ) : (
              <div>
                <Link prefetch href="/book">
                  <a style={{ margin: '20px 20px 0px auto' }}>Book</a>
                </Link>
                <Link prefetch href="/tutorials">
                  <a style={{ margin: '20px 20px 0px auto' }}>Tutorials</a>
                </Link>
                <Link
                  prefetch
                  href={{
                    pathname: '/public/login',
                    query: { next },
                  }}
                  as={{
                    pathname: '/login',
                    query: { next },
                  }}
                >
                  <a style={{ margin: '0px 20px 0px auto' }}>Log in</a>
                </Link>
              </div>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </div>
  );
}

Header.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string.isRequired,
  }),
  hideHeader: PropTypes.bool,
  next: PropTypes.string,
};

Header.defaultProps = {
  user: null,
  hideHeader: false,
  next: '',
};

export default Header;
