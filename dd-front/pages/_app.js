import App, { Container } from 'next/app';
import { Provider } from 'react-redux';

import withReduxStore from '../utils/with-redux-store';

/**
 * Server side:
 * 1) app get initial props
 * 2) document get initial props
 * 3) app render
 * 4) page render
 * 5) document render
 */

/**
 * Client side:
 * 1) app get initial props
 * 2) app render
 * 3) page render
 */

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    // prepare page props
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <Container>
        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default withReduxStore(MyApp);
