import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import PropTypes from 'prop-types';
import React from 'react';
import Head from 'next/head';
import Router from 'next/router';

import NProgress from 'nprogress';

import { theme } from '../lib/theme';

import Notifier from '../components/Notifier';
import Header from '../components/Header';

Router.events.on('routeChangeStart', () => {
  NProgress.start();
});

Router.events.on('routeChangeComplete', (url) => {
  if (window && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }

  NProgress.done();
});

Router.events.on('routeChangeError', () => NProgress.done());

const propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired, // eslint-disable-line
};

function MyApp({ Component, pageProps }) {
  const isServer = typeof window === 'undefined';

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
          <link rel="stylesheet" href={isServer ? '/fonts/server.css' : '/fonts/cdn.css'} />
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

MyApp.propTypes = propTypes;

export default MyApp;
