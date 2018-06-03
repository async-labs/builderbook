import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import NProgress from 'nprogress';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import getContext from '../lib/context';
import Header from '../components/Header';

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

function withLayout(BaseComponent) {
  class App extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.pageContext = this.props.pageContext || getContext();
    }

    componentDidMount() {
      const jssStyles = document.querySelector('#jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      return (
        <MuiThemeProvider
          theme={this.pageContext.theme}
          sheetsManager={this.pageContext.sheetsManager}
        >
          <CssBaseline />
          <div>
            <Header {...this.props} />
            <BaseComponent {...this.props} />
          </div>
        </MuiThemeProvider>
      );
    }
  }

  App.propTypes = {
    pageContext: PropTypes.object, // eslint-disable-line
  };

  App.defaultProps = {
    pageContext: null,
  };

  App.getInitialProps = (ctx) => {
    if (BaseComponent.getInitialProps) {
      return BaseComponent.getInitialProps(ctx);
    }

    return {};
  };

  return App;
}

export default withLayout;
