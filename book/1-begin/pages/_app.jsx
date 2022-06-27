import App from 'next/app';
import React from 'react';
import PropTypes from 'prop-types';

import Header from '../components/Header';

const propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.objectOf(PropTypes.object).isRequired,
};

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    // console.log(pageProps);

    return (
      // Short syntax for React.Fragment
      <>
        <Header {...pageProps} />
        <Component {...pageProps} />
      </>
    );
  }
}

MyApp.propTypes = propTypes;

export default MyApp;
