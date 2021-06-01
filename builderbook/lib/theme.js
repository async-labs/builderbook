import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#238636' },
    secondary: { main: '#b62324' },
    type: 'light',
    background: { default: '#fff' },
    text: {
      primary: '#222',
    },
  },
  typography: {
    fontFamily: 'IBM Plex Mono, monospace',
    button: {
      textTransform: 'none',
    },
  },
});

export { theme };
