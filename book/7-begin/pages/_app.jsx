import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import App from 'next/app';
import PropTypes from 'prop-types';
import React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';

import { theme } from '../lib/theme';

import Notifier from '../components/Notifier';
import Header from '../components/Header';

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

const propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired, // eslint-disable-line
};

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    // console.log(pageProps);

    return (
      <CacheProvider
        value={createCache({
          key: 'css',
        })}
      >
        <ThemeProvider theme={theme}>
          {/* ThemeProvider makes the theme available down the React tree thanks to React context. */}
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link
              rel="stylesheet"
              href="https://storage.googleapis.com/async-await/nprogress-light-spinner.css"
            />
          </Head>
          <CssBaseline />
          {pageProps.chapter ? null : <Header {...pageProps} />}
          <Component {...pageProps} />
          <Notifier />
        </ThemeProvider>
      </CacheProvider>
    );
  }
}

MyApp.propTypes = propTypes;

export default MyApp;
