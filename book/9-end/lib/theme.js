import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#238636' },
    secondary: { main: '#b62324' },
    mode: 'light',
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
