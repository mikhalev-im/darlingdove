import {
  call,
  put,
  takeEvery,
  all
  // select
} from 'redux-saga/effects';

import * as api from '../shared/utils/api';
import Actions from './actions';
import { CHECKOUT_STEPS } from './constants';
import { saveUserData } from '../user/sagas';
// import CartActions from '../cart/actions';
// import { getCartId } from '../cart/selectors';
// import { getToken } from '../user/selectors';
// import { redirect } from '../root/sagas';

export function* saveUserAndChangeStep({ data }) {
  yield call(saveUserData, { data });
  yield put(
    Actions.Creators.changeStep(CHECKOUT_STEPS.ORDER_SUMMARY_STEP_INDEX)
  );
}

export function* createOrderAndPay({ comment }) {
  // const cartId = yield select(getCartId);
  // const token = yield select(getToken);
  // const order = yield call(api.createOrder, cartId);
  // console.log(order);
  // TODO: redirect to pay
  // yield call(redirect, { redirectTo: "/profile" });

  // yield put(CartActions.Creators.resetCartItems());
  yield call(api.payForOrder, comment);
}

export default function* checkoutSagas() {
  yield all([
    takeEvery(Actions.Types.CREATE_ORDER_AND_PAY, createOrderAndPay),
    takeEvery(Actions.Types.SAVE_USER_AND_CHANGE_STEP, saveUserAndChangeStep)
  ]);
}
