import Toolbar from 'material-ui/Toolbar';
import Grid from 'material-ui/Grid';

const styleToolbar = {
  background: '#FFF',
  height: '64px',
  paddingRight: '20px',
};

const styleAnchor = {
  margin: '0px 20px 0px auto',
};

function Header() {
  return (
    <div>
      <Toolbar style={styleToolbar}>
        <Grid container direction="row" justify="space-around" alignItems="center">
          <Grid item sm={9} xs={8} style={{ textAlign: 'left' }}>
            <div />
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
