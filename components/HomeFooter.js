import Link from 'next/link';
import Toolbar from 'material-ui/Toolbar';
import Grid from 'material-ui/Grid';

import { styleToolbar } from './SharedStyles';

function Footer() {
  return (
    <div>
      <Toolbar style={styleToolbar}>
        <Grid container direction="row" justify="space-around" alignItems="center">
          <span>© 2018 Builder Book</span>
          <Link prefetch href="/public/terms" as="/terms">
            <a>Terms</a>
          </Link>
          <a
            style={{ padding: '0px 20px' }}
            href="https://github.com/builderbook"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
        </Grid>
      </Toolbar>
    </div>
  );
}

export default Footer;
