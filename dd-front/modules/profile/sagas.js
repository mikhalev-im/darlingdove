import { all, takeEvery, call, put, select } from 'redux-saga/effects';

import Actions from './actions';
import RootActions from '../root/actions';
import { getUserId } from '../user/selectors';

import { getOrders } from '../shared/utils/api';

export function* loadProfile({ res }) {
  const userId = yield select(getUserId);

  try {
    if (!userId) {
      // redirect to login if there is no user
      yield put(RootActions.Creators.redirect('/login', res));
    } else {
      // fetch orders
      const orders = yield call(getOrders);
      yield put(Actions.Creators.setOrders(orders));
    }

    // resolve waitFor promise
    yield put(Actions.Creators.profileLoaded());
  } catch (err) {
    yield put(Actions.Creators.profileLoaded(err));
  }
}

export default function* profileSagas() {
  yield all([takeEvery(Actions.Types.LOAD_PROFILE, loadProfile)]);
}
