import PropTypes from 'prop-types';
import Link from 'next/link';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Avatar from '@material-ui/core/Avatar';

import MenuDrop from './MenuDrop';
import { styleToolbar } from './SharedStyles';


const optionsMenu = [
  {
    text: 'Got question?',
    href: 'https://github.com/builderbook/builderbook/issues',
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
            {user ? (
              <div>
                <Hidden smDown>
                  <Link href="/">
                    <a style={{ marginRight: '20px' }}>Settings</a>
                  </Link>
                </Hidden>
              </div>
            ) : (
              <Link href="/">
                <Avatar
                  src="https://storage.googleapis.com/builderbook/logo.svg"
                  alt="Builder Book logo"
                  style={{ margin: '0px auto 0px 20px', cursor: 'pointer' }}
                />
              </Link>
            )}
          </Grid>
          <Grid item sm={1} xs={3} style={{ textAlign: 'right' }}>
            {user ? (
              <div style={{ whiteSpace: ' nowrap' }}>
                {user.avatarUrl ? (
                  <MenuDrop options={optionsMenu} src={user.avatarUrl} alt={user.displayName} />
                ) : null}
              </div>
            ) : (
              <Link href="/login">
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
