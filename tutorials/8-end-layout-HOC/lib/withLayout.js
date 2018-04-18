import React from 'react';

import Header from '../components/Header';
import Notifier from '../components/Notifier';
import { getUser } from './api/public';


function withLayout(BaseComponent) {
  class App extends React.Component {
    static async getInitialProps(ctx) {
      // const { user } = ctx.query;
      const user = await getUser();
      // console.log(user);
      const props = { user };

      if (BaseComponent.getInitialProps) {
        Object.assign(props, (await BaseComponent.getInitialProps(ctx)) || {});
      }

      return props;
    }

    render() {
      return (
        <div>
          <Header {...this.props} />
          <BaseComponent {...this.props} />
          <Notifier />
        </div>
      );
    }
  }

  return App;
}

export default withLayout;
