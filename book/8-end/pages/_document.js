/* eslint-disable react/no-danger */
import React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/styles';
// import htmlescape from 'htmlescape';

// const { StripePublishableKey } = process.env;
// // console.log(StripePublishableKey);

// const env = { StripePublishableKey };
// // console.log(env);

class MyDocument extends Document {
  static getInitialProps = async (ctx) => {
    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    };
  };

  render() {
    return (
      <Html lang="en" style={{ height: '100%' }}>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="google" content="notranslate" />
          <meta name="theme-color" content="#1976D2" />

          {/* new meta tag */}
          <meta
            httpEquiv="Content-Security-Policy"
            content="
            default-src 'self' 'unsafe-inline' *.googleapis.com *.gstatic.com *.amazonaws.com;
          "
          />

          <link
            rel="shortcut icon"
            href="https://storage.googleapis.com/builderbook/favicon32.png"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Muli:300,400:latin"
          />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <link
            rel="stylesheet"
            href="https://storage.googleapis.com/builderbook/nprogress.min.css"
          />
          <link rel="stylesheet" href="https://storage.googleapis.com/builderbook/vs.min.css" />

          <style>
            {`
              a, a:focus {
                font-weight: 400;
                color: #1565C0;
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
                font-size: 14px;
              }
              code {
                font-size: 14px;
                background: #FFF;
              }
            `}
          </style>
        </Head>
        <body
          style={{
            font: '16px Muli',
            color: '#222',
            margin: '0px auto',
            fontWeight: '300',
            lineHeight: '1.5em',
            backgroundColor: '#F7F9FC',
            minHeight: '100%',
          }}
        >
          <Main />
          {/* Added next.config.js
          {/* eslint-disable-next-line react/no-danger */}
          {/* <script dangerouslySetInnerHTML={{ __html: `__ENV__ = ${htmlescape(env)}` }} /> */}
          <NextScript />
        </body>
      </Html>
    );
  }
}

// MyDocument.getInitialProps = async (ctx) => {
//   // Resolution order
//   //
//   // On the server:
//   // 1. app.getInitialProps
//   // 2. page.getInitialProps
//   // 3. document.getInitialProps
//   // 4. app.render
//   // 5. page.render
//   // 6. document.render
//   //
//   // On the server with error:
//   // 1. document.getInitialProps
//   // 2. app.render
//   // 3. page.render
//   // 4. document.render
//   //
//   // On the client
//   // 1. app.getInitialProps
//   // 2. page.getInitialProps
//   // 3. app.render
//   // 4. page.render

//   // Render app and page and get the context of the page with collected side effects.
//   const sheets = new ServerStyleSheets();
//   const originalRenderPage = ctx.renderPage;

//   ctx.renderPage = () =>
//     originalRenderPage({
//       enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
//     });

//   const initialProps = await Document.getInitialProps(ctx);

//   return {
//     ...initialProps,
//     // Styles fragment is rendered after the app and page rendering finish.
//     styles: (
//       <React.Fragment>
//         {initialProps.styles}
//         {sheets.getStyleElement()}
//       </React.Fragment>
//     ),
//   };
// };

export default MyDocument;
