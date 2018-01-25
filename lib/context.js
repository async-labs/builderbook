import { SheetsRegistry } from 'react-jss';
import { createMuiTheme, createGenerateClassName } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';
import grey from 'material-ui/colors/grey';

const theme = createMuiTheme({
  palette: {
    primary: { main: blue[700] },
    secondary: { main: grey[900] },
  },
});

function createPageContext() {
  return {
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName(),
  };
}

export default function getContext() {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (!process.browser) {
    return createPageContext();
  }

  // Reuse context on the client-side.
  if (!global.INIT_MATERIAL_UI) {
    global.INIT_MATERIAL_UI = createPageContext();
  }

  return global.INIT_MATERIAL_UI;
}
