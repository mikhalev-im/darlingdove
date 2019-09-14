import { call, put, takeEvery, all, select } from 'redux-saga/effects';

// import * as api from '../shared/utils/api';
import Actions from './actions';
import RootActions from '../root/actions';
import { CHECKOUT_STEPS } from './constants';
import { saveUserData } from '../user/sagas';
import { getUserId } from '../user/selectors';
import { getCartItems } from '../cart/selectors';
// import CartActions from '../cart/actions';
// import { getCartId } from '../cart/selectors';
// import { getToken } from '../user/selectors';
// import { redirect } from '../root/sagas';

export function* loadCheckoutPage({ res }) {
  const userId = yield select(getUserId);
  const items = yield select(getCartItems);

  if (!userId) {
    // redirect to login if no user
    yield put(RootActions.Creators.redirect('/login?redirect=/checkout', res));
  } else if (!items.length) {
    // redirect back to cart if no items
    yield put(RootActions.Creators.redirect('/cart', res));
  } else {
    // set step to address information
    yield put(Actions.Creators.changeStep(CHECKOUT_STEPS.ADDRESS_STEP_INTEX));
  }

  // resolve waitFor promise
  yield put(Actions.Creators.checkoutPageLoaded());
}

export function* saveUserAndChangeStep({ data }) {
  yield call(saveUserData, { data });
  yield put(
    Actions.Creators.changeStep(CHECKOUT_STEPS.ORDER_SUMMARY_STEP_INDEX)
  );
}

// eslint-disable-next-line
export function* createOrderAndPay({ comment }) {
  // const cartId = yield select(getCartId);
  // const token = yield select(getToken);
  // const order = yield call(api.createOrder, cartId);
  // console.log(order);
  // TODO: redirect to pay
  // yield call(redirect, { redirectTo: "/profile" });
  // yield put(CartActions.Creators.resetCartItems());
  // yield call(api.payForOrder, comment);
}

export default function* checkoutSagas() {
  yield all([
    takeEvery(Actions.Types.LOAD_CHECKOUT_PAGE, loadCheckoutPage),
    takeEvery(Actions.Types.CREATE_ORDER_AND_PAY, createOrderAndPay),
    takeEvery(Actions.Types.SAVE_USER_AND_CHANGE_STEP, saveUserAndChangeStep)
  ]);
}
