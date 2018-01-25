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
  },
];


function Header({ user }) {
  return (
    <div>
      <Toolbar style={styleToolbar}>
        <Grid container direction="row" justify="space-around" alignItems="center">
          <Grid item sm={10} xs={9} style={{ textAlign: 'left' }}>
            <Link prefetch href="/">
              <a>
                <Avatar
                  src="https://storage.googleapis.com/builderbook-homepage/bb-logo-blue.svg?v=1"
                  alt="Builder Book logo"
                  style={{ margin: '0px auto 0px 20px' }}
                />
              </a>
            </Link>
          </Grid>
          <Grid item sm={2} xs={3} style={{ textAlign: 'right' }}>
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

              </div>) : (
                <Link prefetch href="/public/login" as="/login">
                  <a style={{ margin: '0px 20px 0px auto' }}>Log in</a>
                </Link>
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
