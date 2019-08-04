import {
  all,
  put,
  call,
  delay,
  select,
  takeEvery,
  takeLatest
} from 'redux-saga/effects';
import * as Cookie from 'js-cookie';

import api from '../shared/utils/api';
import { COOKIE } from '../../constants';
import Actions from './actions';
import NotificationsActions from '../notifications/actions';
import { getCartId, getCartItems } from './selectors';

const CART_UPDATE_DEBOUNCE = 2000;

// error handling
// loading indicator
export function* addToCart({ productId, qty = 1 }) {
  // get cartId from store
  const cartId = yield select(getCartId);
  // make api request
  const cart = yield call([api, 'addToCart'], productId, Number(qty), cartId);
  // set cart id to cookie
  yield call([Cookie, 'set'], COOKIE.CART_ID, cart._id);
  // set cart id and items to store
  yield put(Actions.Creators.setCart(cart));
  // find item that was added and show success notification
  const { product } = cart.items.find(item => item.product._id === productId);
  yield put(
    NotificationsActions.Creators.addNotification({
      key: 'productAddedToCart',
      message: `Товар "${product.name}" добавлен в корзину!`
    })
  );
}

// error handling
// loading indicator
export function* removeFromCart({ productId }) {
  // get cartId from store
  const cartId = yield select(getCartId);
  // make api request
  const cart = yield call([api, 'removeProductFromCart'], cartId, productId);
  // set cart id and items to store
  yield put(Actions.Creators.setCart(cart));
}

// error handling
// loading indicator
export function* updateCartItemsQty() {
  // get cart items from store
  const items = yield select(getCartItems);
  // prepare data to send to api
  const data = items.map(item => ({
    qty: item.qty,
    product: item.product._id
  }));
  // get cart id from store
  const cartId = yield select(getCartId);
  // make api request
  const cart = yield call([api, 'cartBulkQtyUpdate'], cartId, data);
  // set cart id and items to store
  console.log(cart);
  yield put(Actions.Creators.setCart(cart));
}

// error handling
// loading indicator
export function* debouncedCartQtyUpdate() {
  yield delay(CART_UPDATE_DEBOUNCE);
  yield put(Actions.Creators.updateCartItemsQty());
}

export default function* cartSagas() {
  yield all([
    takeEvery(Actions.Types.ADD_TO_CART, addToCart),
    takeEvery(Actions.Types.REMOVE_FROM_CART, removeFromCart),
    takeEvery(Actions.Types.UPDATE_CART_ITEMS_QTY, updateCartItemsQty),
    takeLatest(Actions.Types.DEBOUNCED_CART_QTY_UPDATE, debouncedCartQtyUpdate)
  ]);
}
