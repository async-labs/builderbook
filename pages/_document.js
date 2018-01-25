import React from 'react';

import JssProvider from 'react-jss/lib/JssProvider';
import Document, { Head, Main, NextScript } from 'next/document';

import getContext from '../lib/context';

class MyDocument extends Document {
  render() {
    const context = getContext();
    return (
      <html lang="en">
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Muli:300,400,600:latin"
            rel="stylesheet"
          />
          <meta charSet="utf-8" />
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name="viewport"
            content={
              'user-scalable=0, initial-scale=1, maximum-scale=1, ' +
              'minimum-scale=1, width=device-width, height=device-height'
            }
          />
          <meta name="google" content="notranslate" />
          <meta httpEquiv="Content-Language" content="en_US" />
          {/* PWA primary color */}
          <meta name="theme-color" content={context.theme.palette.primary[900]} />

          <link
            rel="shortcut icon"
            type="image/png"
            href="https://storage.googleapis.com/builderbook-homepage/bb-logo-blue.svg?v=1"
          />
          <link rel="stylesheet" type="text/css" href="/static/nprogress.css" />

          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/vs.min.css"
          />
          <style>
            {`
              a, a:focus {
                font-weight: 400;
                color: #1565C0;                ;
                text-decoration: none;
                outline: none
              }
              a:hover, button:hover {
                opacity: 0.75;
                cursor: pointer
              }
              blockquote {
                padding: 0 1em;
                color: #555;
                border-left: 0.25em solid #dfe2e5;
              }
              pre {
                display:block;
                overflow-x:auto;
                padding:0.5em;
                background:#FFF;
                color: #000;
                border: 1px solid #ddd;
              }
              code {
                font-size: 14px;
              }
            `}
          </style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

MyDocument.getInitialProps = (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. page.getInitialProps
  // 2. document.getInitialProps
  // 3. page.render
  // 4. document.render
  //
  // On the server with error:
  // 2. document.getInitialProps
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. page.getInitialProps
  // 3. page.render

  // Get the context of the page to collected side effects.
  const pageContext = getContext();
  const page = ctx.renderPage(Component => props => (
    <JssProvider
      registry={pageContext.sheetsRegistry}
      generateClassName={pageContext.generateClassName}
    >
      <Component pageContext={pageContext} {...props} />
    </JssProvider>
  ));

  return {
    ...page,
    pageContext,
    styles: (
      <style
        id="jss-server-side"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: pageContext.sheetsRegistry.toString() }}
      />
    ),
  };
};

export default MyDocument;
