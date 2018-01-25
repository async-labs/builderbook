import React from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import { withStyles, MuiThemeProvider } from 'material-ui/styles';
import Reboot from 'material-ui/Reboot';

import getContext from '../lib/context';
import Notifier from '../components/Notifier';
import Header from '../components/Header';

const styles = {
  '@global': {
    html: {
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
    },
    body: {
      font: '16px Muli',
      color: '#222',
      margin: '0px auto',
      fontWeight: '300',
      lineHeight: '1.5em',
      backgroundColor: '#F7F9FC',
    },
    span: {
      fontFamily: 'Muli !important',
    },
  },
};

let AppWrapper = props => props.children;

AppWrapper = withStyles(styles, { name: 'App' })(AppWrapper);

function withLayout(BaseComponent, { noHeader = false } = {}) {
  class App extends React.Component {
    static propTypes = {
      pageContext: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    };

    static defaultProps = {
      pageContext: null,
    };
    static getInitialProps(ctx) {
      if (BaseComponent.getInitialProps) {
        return BaseComponent.getInitialProps(ctx);
      }

      return {};
    }

    constructor(props, ...args) {
      super(props, ...args);

      this.state = {
        hideHeader: false,
      };
    }

    componentWillMount() {
      this.pageContext = this.props.pageContext || getContext();
    }

    componentDidMount() {
      const elem = document.getElementById('main-content');
      if (elem) {
        elem.addEventListener('scroll', this.onScroll);
      }

      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector('#jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    componentWillUnmount() {
      const elem = document.getElementById('main-content');
      if (elem) {
        elem.removeEventListener('scroll', this.onScroll);
      }
    }

    onScroll = throttle(() => {
      const elem = document.getElementById('main-content');
      const distanceFromTop = elem.scrollTop;
      const hideHeader = distanceFromTop > 300;

      if (this.state.hideHeader !== hideHeader) {
        this.setState({ hideHeader });
      }
    }, 500);

    pageContext = null;

    render() {
      const { hideHeader } = this.state;

      return (
        <MuiThemeProvider
          theme={this.pageContext.theme}
          sheetsManager={this.pageContext.sheetsManager}
        >
          {/* Reboot kickstart an elegant, consistent, and simple baseline to build upon. */}
          <Reboot />

          <div>
            {noHeader ? null : <Header hideHeader={hideHeader} {...this.props} />}
            <AppWrapper>
              <BaseComponent hideHeader={hideHeader} {...this.props} />
            </AppWrapper>
            <Notifier />
          </div>
        </MuiThemeProvider>
      );
    }
  }

  App.displayName = `withLayout(${BaseComponent.displayName})`;

  return App;
}

export default withLayout;
