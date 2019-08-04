import React from 'react';
import * as Cookie from 'js-cookie';

import { COOKIE } from '../constants';
import { initializeStore } from '../modules/root/store';
import { isServer, parseCookie } from './helpers';
import { INITIAL_STATE as cartInitState } from '../modules/cart/reducer';
import { INITIAL_STATE as userInitState } from '../modules/user/reducer';
import api from '../modules/shared/utils/api';

const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

const getInitialState = async ctx => {
  let token;
  let cartId;
  if (isServer) {
    token = parseCookie(COOKIE.ACCESS_TOKEN, ctx.req.headers['cookie']);
    cartId = parseCookie(COOKIE.CART_ID, ctx.req.headers['cookie']);
  } else {
    // no need to create an initial store if it is already exists
    if (window[__NEXT_REDUX_STORE__]) return;

    token = Cookie.get(COOKIE.ACCESS_TOKEN);
    cartId = Cookie.get(COOKIE.CART_ID);
  }

  // try to load user by token
  let user = {};
  if (token) {
    // TODO: error handling
    try {
      user = await api.getCurrentUser(token);
      user.jwt = token;
    } catch (err) {
      console.error(err);
    }
  }

  // if there is cart id, try to load cart
  let cart = {};
  if (cartId) {
    try {
      cart = await api.getCart(cartId);
    } catch (err) {
      console.error(err);
    }
  }

  user = userInitState
    .set('firstName', user.firstName || '')
    .set('lastName', user.lastName || '')
    .set('country', user.country || '')
    .set('postalCode', user.postalCode || '')
    .set('address', user.address || '')
    .set('email', user.email || '')
    .set('_id', user._id || '')
    .set('jwt', user.jwt || '');

  cart = cartInitState
    .set('_id', cart._id || null)
    .set('items', cart.items || [])
    .set('services', cart.services || []);

  return { cart, user };
};

const getOrCreateStore = initialState => {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return initializeStore(initialState);
  }

  // Store in global variable if client
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = initializeStore(initialState);
  }
  return window[__NEXT_REDUX_STORE__];
};

export default App => {
  return class Redux extends React.Component {
    static async getInitialProps(appContext) {
      const initialState = await getInitialState(appContext.ctx);
      const reduxStore = getOrCreateStore(initialState);

      // Provide the store to getInitialProps of pages
      appContext.ctx.reduxStore = reduxStore;

      let appProps = {};
      if (App.getInitialProps) {
        appProps = await App.getInitialProps(appContext);
      }

      return {
        ...appProps,
        initialReduxState: reduxStore.getState()
      };
    }

    constructor(props) {
      super(props);
      this.reduxStore = getOrCreateStore(props.initialReduxState);
    }

    render() {
      return <App {...this.props} reduxStore={this.reduxStore} />;
    }
  };
};
