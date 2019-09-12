import { all, takeEvery, put, call } from 'redux-saga/effects';

import { getHomePage } from '../shared/utils/api';
import Actions from './actions';

export function* loadHomePage() {
  const { blocks } = yield call(getHomePage);
  // resolve waitFor promise
  yield put(Actions.Creators.homePageLoaded(blocks));
}

export default function* homeSagas() {
  yield all([takeEvery(Actions.Types.LOAD_HOME_PAGE, loadHomePage)]);
}
