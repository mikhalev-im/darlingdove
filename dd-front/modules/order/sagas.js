import { all, call, takeEvery, put, select } from 'redux-saga/effects';

import Actions from './actions';
import RootActions from '../root/actions';
import { getUserId } from '../user/selectors';
import { getOrder } from '../shared/utils/api';

export function* loadOrderPage({ res, query }) {
  const userId = yield select(getUserId);

  if (!userId) {
    // redirect if user alredy logged in
    yield put(RootActions.Creators.redirect('/login', res));
  } else {
    const order = yield call(getOrder, query.id);
    yield put(Actions.Creators.setOrder(order));
  }

  // resolve waitFor promise
  yield put(Actions.Creators.loginPageLoaded());
}

export default function* orderSagas() {
  yield all([takeEvery(Actions.Types.LOAD_ORDER_PAGE, loadOrderPage)]);
}
