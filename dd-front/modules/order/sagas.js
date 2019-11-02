import { all, call, takeEvery, put, select } from 'redux-saga/effects';

import Actions from './actions';
import RootActions from '../root/actions';
import { getUserId } from '../user/selectors';
import { getOrder, payForOrder } from '../shared/utils/api';

export function* loadOrderPage({ res, query }) {
  const userId = yield select(getUserId);

  try {
    if (!userId) {
      // redirect if user alredy logged in
      yield put(RootActions.Creators.redirect('/login', res));
    } else {
      const order = yield call(getOrder, query.id);
      yield put(Actions.Creators.setOrder(order));
    }

    // resolve waitFor promise
    yield put(Actions.Creators.orderPageLoaded());
  } catch (err) {
    yield put(Actions.Creators.orderPageLoaded(err));
  }
}

export function* onPay({ orderId }) {
  const { url } = yield call(payForOrder, orderId);
  window.location.href = url;
}

export default function* orderSagas() {
  yield all([
    takeEvery(Actions.Types.LOAD_ORDER_PAGE, loadOrderPage),
    takeEvery(Actions.Types.ON_PAY, onPay)
  ]);
}
