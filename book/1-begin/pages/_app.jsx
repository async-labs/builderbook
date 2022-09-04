import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import App from 'next/app';
import PropTypes from 'prop-types';
import React from 'react';

import dynamic from 'next/dynamic';
import { theme } from '../lib/theme';

// import Header from '../components/Header';
const Header = dynamic(import('../components/Header'), { ssr: false });

const propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired, // eslint-disable-line
};

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    // console.log(pageProps);

    return (
      <CacheProvider value={createCache({ key: 'css' })}>
        <ThemeProvider theme={theme}>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <CssBaseline />
          <Header {...pageProps} />
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    );
  }
}

MyApp.propTypes = propTypes;

export default MyApp;
