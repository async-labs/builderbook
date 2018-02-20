import React from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import { MuiThemeProvider } from 'material-ui/styles';
import Reboot from 'material-ui/Reboot';

import getContext from '../lib/context';
import Notifier from '../components/Notifier';
import Header from '../components/Header';

function withLayout(BaseComponent, { noHeader = false } = {}) {
  class App extends React.Component {
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
      const hideHeader = distanceFromTop > 500;

      if (this.state.hideHeader !== hideHeader) {
        this.setState({ hideHeader });
      }
    }, 500);

    render() {
      const { hideHeader } = this.state;

      return (
        <MuiThemeProvider
          theme={this.pageContext.theme}
          sheetsManager={this.pageContext.sheetsManager}
        >
          <Reboot />
          <div>
            {noHeader ? null : <Header hideHeader={hideHeader} {...this.props} />}
            <BaseComponent hideHeader={hideHeader} {...this.props} />
            <Notifier />
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
