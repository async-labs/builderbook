import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

let globalUser = null;

export default (
  Page,
  { loginRequired = true, logoutRequired = false, adminRequired = false } = {},
) =>
  class BaseComponent extends React.Component {
    static propTypes = {
      user: PropTypes.shape({
        id: PropTypes.string,
        isAdmin: PropTypes.bool,
      }),
      isFromServer: PropTypes.bool.isRequired,
    };

    static defaultProps = {
      user: null,
    };

    static async getInitialProps(ctx) {
      const isFromServer = !!ctx.req;
      const user = ctx.req ? ctx.req.user && ctx.req.user.toObject() : globalUser;

      if (isFromServer && user) {
        user._id = user._id.toString();
      }

      const props = { user, isFromServer };

      if (Page.getInitialProps) {
        Object.assign(props, (await Page.getInitialProps(ctx)) || {});
      }

      return props;
    }

    componentDidMount() {
      const { user } = this.props;

      if (this.props.isFromServer) {
        globalUser = this.props.user;
      }

      if (loginRequired && !logoutRequired && !user) {
        Router.push('/public/login', '/login');
        return;
      }

      if (adminRequired && (!user || !user.isAdmin)) {
        Router.push('/');
      }

      if (logoutRequired && user) {
        Router.push('/');
      }
    }

    render() {
      const { user } = this.props;

      if (loginRequired && !logoutRequired && !user) {
        return null;
      }

      if (adminRequired && (!user || !user.isAdmin)) {
        return null;
      }

      if (logoutRequired && user) {
        return null;
      }

      return <Page {...this.props} />;
    }
  };
