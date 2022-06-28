/* eslint-disable react/no-danger */
import React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import PropTypes from 'prop-types';

import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';

const propTypes = {
  styles: PropTypes.arrayOf(
    PropTypes.string || PropTypes.number || PropTypes.ReactElementLike || React.ReactFragment,
  ).isRequired,
};

function MyDocument({ styles }) {
  return (
    <Html lang="en" style={{ height: '100%' }}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="google" content="notranslate" />
        <meta name="theme-color" content="#1976D2" />

        <link rel="shortcut icon" href="https://storage.googleapis.com/builderbook/favicon32.png" />

        <link rel="stylesheet" href="/fonts/server.css" />
        <link rel="stylesheet" href="https://storage.googleapis.com/builderbook/vs.min.css" />

        <style>
          {`
              a {
                font-weight: 400;
                color: #58a6ff;
                text-decoration: none;
                outline: none;
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
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        {/* Inject styles first to match with the prepend: true configuration. */}
        {styles}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx) => {
  // Render app and page and get the context of the page with collected side effects.
  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createCache({
    key: 'css',
    prepend: true,
  });
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      // eslint-disable-next-line react/display-name
      enhanceApp: (App) => (props) => <App emotionCache={cache} {...props} />,
    });

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
  const chunks = extractCriticalToChunks(initialProps.html);

  const emotionStyleTags = chunks.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), ...emotionStyleTags],
  };
};

MyDocument.propTypes = propTypes;

export default MyDocument;
