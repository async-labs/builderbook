import PropTypes from 'prop-types';
import Link from 'next/link';
import Toolbar from 'material-ui/Toolbar';
import Grid from 'material-ui/Grid';
import Avatar from 'material-ui/Avatar';

import MenuDrop from './MenuDrop';

import { styleToolbar } from './SharedStyles';

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

function Header({ user }) {
  return (
    <div>
      <Toolbar style={styleToolbar}>
        <Grid container direction="row" justify="space-around" alignItems="center">
          <Grid item sm={8} xs={6} style={{ textAlign: 'left' }}>
            {!user ? (
              <Link prefetch href="/">
                <Avatar
                  src="https://storage.googleapis.com/builderbook/logo.svg"
                  alt="Builder Book logo"
                  style={{ margin: '0px auto 0px 20px', cursor: 'pointer' }}
                />
              </Link>
            ) : null}
          </Grid>
          <Grid item sm={4} xs={6} style={{ textAlign: 'right' }}>
            {user ? (
              <div style={{ whiteSpace: 'nowrap' }}>
                {!user.isAdmin ? (
                  <div>
                    <Link prefetch href="/book" as="/book">
                      <a style={{ margin: '20px 30px 0px auto', verticalAlign: 'middle' }}>Book</a>
                    </Link>
                    <Link prefetch href="/tutorials">
                      <a style={{ margin: '20px 30px 0px auto' }}>Tutorials</a>
                    </Link>
                    <MenuDrop
                      options={optionsMenuCustomer}
                      src={user.avatarUrl}
                      alt={user.displayName}
                    />
                  </div>
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
                <Link prefetch href="/book" as="/book">
                  <a style={{ margin: '20px 30px 0px auto' }}>Book</a>
                </Link>
                <Link prefetch href="/tutorials">
                  <a style={{ margin: '20px 30px 0px auto' }}>Tutorials</a>
                </Link>
                <Link prefetch href="/public/login" as="/login">
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
};

Header.defaultProps = {
  user: null,
};

export default Header;
