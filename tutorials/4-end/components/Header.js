import Link from 'next/link';
import Toolbar from 'material-ui/Toolbar';
import Grid from 'material-ui/Grid';
import Avatar from 'material-ui/Avatar';

const styleToolbar = {
  background: '#FFF',
  height: '64px',
  paddingRight: '20px',
};

function Header() {
  return (
    <div>
      <Toolbar style={styleToolbar}>
        <Grid container direction="row" justify="space-around" alignItems="center">
          <Grid item sm={6} xs={6} style={{ textAlign: 'left' }}>
            <Link prefetch href="/" as="/">
              <a>
                <Avatar
                  src="https://storage.googleapis.com/builderbook/logo.svg"
                  alt="Builder Book logo"
                  style={{ margin: '0px auto 0px 20px' }}
                />
              </a>
            </Link>
          </Grid>
          <Grid item sm={6} xs={6} style={{ textAlign: 'right' }}>
            <a
              href="https://builderbook.org/book"
              target="_blank"
              rel="noopener noreferrer"
            >
              Builder Book
            </a>
          </Grid>
        </Grid>
      </Toolbar>
    </div>
  );
}

export default Header;
