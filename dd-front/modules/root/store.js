import Immutable from 'seamless-immutable';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { fork, all } from 'redux-saga/effects';
import { composeWithDevTools } from 'redux-devtools-extension';

import waitForActionMiddleware from './middlewares/wait-for';
import bindEvents from './events';

import cart from '../cart/reducer';
import user from '../user/reducer';
import root from '../root/reducer';
import order from '../order/reducer';
import product from '../product/reducer';
import profile from '../profile/reducer';
import checkout from '../checkout/reducer';
import category from '../categories/reducer';
import notifications from '../notifications/reducer';

import rootSagas from './sagas';
import homeSagas from '../home/sagas';
import cartSagas from '../cart/sagas';
import userSagas from '../user/sagas';
import loginSagas from '../login/sagas';
import orderSagas from '../order/sagas';
import prodcutSagas from '../product/sagas';
import profileSagas from '../profile/sagas';
import checkoutSagas from '../checkout/sagas';
import categorySagas from '../categories/sagas';
import notificationsSagas from '../notifications/sagas';

const reducer = combineReducers({
  cart,
  user,
  root,
  order,
  product,
  profile,
  category,
  checkout,
  notifications
});

function* sagas() {
  yield all([
    fork(cartSagas),
    fork(userSagas),
    fork(rootSagas),
    fork(homeSagas),
    fork(loginSagas),
    fork(orderSagas),
    fork(prodcutSagas),
    fork(profileSagas),
    fork(categorySagas),
    fork(checkoutSagas),
    fork(notificationsSagas)
  ]);
}

export function initializeStore(initialState = {}) {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    reducer,
    Immutable(initialState),
    composeWithDevTools(
      applyMiddleware(waitForActionMiddleware, sagaMiddleware)
    )
  );

  sagaMiddleware.run(sagas);

  bindEvents(store);

  return store;
}
