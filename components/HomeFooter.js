import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';

import { styleToolbar } from '../lib/SharedStyles';

function Footer() {
  return (
    <div>
      <Toolbar style={styleToolbar}>
        <Grid container direction="row" justify="space-around" alignItems="center">
          <span>{`© ${new Date().getFullYear()} Builder Book`}</span>
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
