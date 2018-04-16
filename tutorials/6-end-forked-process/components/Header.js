import Toolbar from 'material-ui/Toolbar';
import Grid from 'material-ui/Grid';
import { styleToolbar } from './SharedStyles';

const styleAnchor = {
  margin: '0px 20px 0px auto',
};

function Header() {
  return (
    <div>
      <Toolbar style={styleToolbar}>
        <Grid container direction="row" justify="space-around" alignItems="center">
          <Grid item sm={9} xs={8} style={{ textAlign: 'left' }}>
            <a href="/" target="_blank" style={styleAnchor}>
              Open page in new tab
            </a>
          </Grid>
          <Grid item sm={3} xs={4} style={{ textAlign: 'right' }}>
            <a
              href="https://builderbook.org/book"
              target="_blank"
              rel="noopener noreferrer"
              style={styleAnchor}
            >
              Our book
            </a>
          </Grid>
        </Grid>
      </Toolbar>
    </div>
  );
}

export default Header;
