import PropTypes from 'prop-types';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import Toolbar from 'material-ui/Toolbar';
import Grid from 'material-ui/Grid';
import Avatar from 'material-ui/Avatar';

import { styleToolbar } from './SharedStyles';

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

function Header() {
  return (
    <div>
      <Toolbar style={styleToolbar}>
        <Grid container direction="row" justify="space-around" alignItems="center">
          <Grid item sm={10} xs={9} style={{ textAlign: 'left' }}>
            <Link prefetch href="/">
              <a>
                <Avatar
                  src="https://storage.googleapis.com/builderbook/logo.svg"
                  alt="Builder Book logo"
                  style={{ margin: '0px auto 0px 20px' }}
                />
              </a>
            </Link>
          </Grid>
          <Grid item sm={1} xs={3} style={{ textAlign: 'right' }}>
            <Link prefetch href="/login">
              <a style={{ margin: '0px 20px 0px auto' }}>Log in</a>
            </Link>
          </Grid>
        </Grid>
      </Toolbar>
    </div>
  );
}

export default Header;
