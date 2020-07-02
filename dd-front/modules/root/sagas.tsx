import { all, call, takeEvery, put } from 'redux-saga/effects';
import Router from 'next/router';

import Actions, { RedirectAction, RedirectTo } from './actions';
import UserActions from '../user/actions';
import CartActions from '../cart/actions';
import { getCurrentUser, getCart, configure } from '../shared/utils/api';
import { parseCookie } from '../shared/utils/cookie';
import { COOKIE_TOKEN, COOKIE_CART } from './constants';
import { ServerResponse } from 'http';

const serverSideRedirect = (res: ServerResponse, redirectTo: RedirectTo) => {
  if (typeof redirectTo === 'object') {
    res.writeHead(302, { Location: redirectTo.as });
  } else {
    res.writeHead(302, { Location: redirectTo });
  }
  res.end();
};

export function* redirect({ redirectTo, res }: RedirectAction) {
  if (!res) {
    // client-side
    typeof redirectTo === 'string'
      ? yield call([Router, 'push'], redirectTo)
      : yield call([Router, 'push'], redirectTo.url, redirectTo.as);

    // by default next router doesn't scroll to top
    yield call([window, 'scroll'], { top: 0, left: 0 });

    return;
  }

  yield call(serverSideRedirect, res, redirectTo);
}

// will run only on server
export function* initialize({ ctx }) {
  // parse cookie
  const token = parseCookie(COOKIE_TOKEN, ctx.req.headers['cookie']);
  const cartId = parseCookie(COOKIE_CART, ctx.req.headers['cookie']);

  // fetch user and put in store
  if (token) {
    try {
      yield call(configure, token);
      const user = yield call(getCurrentUser);
      yield put(
        UserActions.Creators.setUser({
          jwt: token,
          ...user
        })
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  // fetch cart and put in store
  if (cartId) {
    try {
      const cart = yield call(getCart, cartId);
      yield put(CartActions.Creators.setCart(cart));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  yield put(Actions.Creators.initialized());
}

export default function* rootSaga() {
  yield all([
    takeEvery(Actions.Types.REDIRECT, redirect),
    takeEvery(Actions.Types.INITIALIZE, initialize)
  ]);
}
