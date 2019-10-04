import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/styles';
import getConfig from 'next/config';
import theme from '../modules/shared/utils/theme';

const { publicRuntimeConfig } = getConfig();

const SCHEMA_ORG_ORGANIZATION = {
  '@context': 'http://schema.org',
  '@type': 'Organization',
  name: 'DarlingDove',
  url: publicRuntimeConfig.CLIENT_BASE_URL,
  email: 'info@darlingdove.ru',
  logo: 'https://darlingdove.ru/image/catalog/cartoon.png'
};

const META = {
  baseUrl: publicRuntimeConfig.CLIENT_BASE_URL,
  title: 'Интернет магазин почтовых открыток для посткроссинга DarlingDove',
  keywords:
    'Купить почтовые открытки карточки почта посткроссинг postcrossing интернет магазин',
  description:
    'Чудесный магазин почтовых открыток! Здесь вы можете купить качественные почтовые открытки для посткроссинга и сопутствующие товары!'
};

class MyDocument extends Document {
  render() {
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
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(SCHEMA_ORG_ORGANIZATION)
            }}
          />
          <title key="title">{META.title}</title>
          <base href={META.baseUrl} />
          <meta
            key="description"
            name="description"
            content={META.description}
          />
          <meta key="keywords" name="keywords" content={META.keywords} />
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
// 1. app.getInitialProps
// 2. page.getInitialProps
// 3. document.getInitialProps
// 4. app.render
// 5. page.render
// 6. document.render
//
// On the server with error:
// 1. document.getInitialProps
// 2. app.render
// 3. page.render
// 4. document.render
//
// On the client
// 1. app.getInitialProps
// 2. page.getInitialProps
// 3. app.render
// 4. page.render

MyDocument.getInitialProps = async ctx => {
  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props => sheets.collect(<App {...props} />)
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      <React.Fragment key="styles">
        {initialProps.styles}
        {sheets.getStyleElement()}
      </React.Fragment>
    ]
  };
};

export default MyDocument;
