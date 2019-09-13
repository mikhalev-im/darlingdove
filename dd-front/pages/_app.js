import React from 'react';
import App, { Container } from 'next/app';
import { Provider } from 'react-redux';

import { initialize } from '../modules/root';

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
  static async getInitialProps({ Component, ctx }) {
    ctx.reduxStore = await initialize({}, ctx);

    // prepare page props
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps, reduxState: ctx.reduxStore.getState() };
  }

  constructor(props) {
    super();
    this.reduxStore = initialize(props.reduxState);
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Provider store={this.reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default MyApp;
