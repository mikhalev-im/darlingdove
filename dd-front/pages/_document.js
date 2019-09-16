import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import JssProvider from 'react-jss/lib/JssProvider';
import flush from 'styled-jsx/server';

import getPageContext from '../utils/get-page-context';

const SCHEMA_ORG_ORGANIZATION = {
  '@context': 'http://schema.org',
  '@type': 'Organization',
  name: 'DarlingDove',
  url: 'http://darlingdove.ru',
  email: 'info@darlingdove.ru',
  logo: 'https://darlingdove.ru/image/catalog/cartoon.png'
};

class MyDocument extends Document {
  render() {
    const { pageContext } = this.props;

    return (
      <html lang="en" dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name="viewport"
            content={
              'user-scalable=0, initial-scale=1, ' +
              'minimum-scale=1, width=device-width, height=device-height'
            }
          />
          {/* PWA primary color */}
          <meta
            name="theme-color"
            content={pageContext.theme.palette.primary.main}
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(SCHEMA_ORG_ORGANIZATION)
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

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

MyDocument.getInitialProps = ctx => {
  // Get the context of the page to collected side effects.
  const pageContext = getPageContext();
  const page = ctx.renderPage(Component => {
    const comp = props => (
      <JssProvider
        registry={pageContext.sheetsRegistry}
        generateClassName={pageContext.generateClassName}
      >
        <Component pageContext={pageContext} {...props} />
      </JssProvider>
    );

    return comp;
  });

  return {
    ...page,
    pageContext,
    styles: (
      <React.Fragment>
        <style
          id="jss-server-side"
          dangerouslySetInnerHTML={{
            __html: pageContext.sheetsRegistry.toString()
          }}
        />
        {flush() || null}
      </React.Fragment>
    )
  };
};

export default MyDocument;
