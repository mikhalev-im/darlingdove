import { all, takeEvery, put, call } from 'redux-saga/effects';

import { getPage } from '../shared/utils/api';
import Actions from './actions';

export function* loadPage({ query }) {
  const { blocks } = yield call(getPage, query.slug);
  // resolve waitFor promise
  yield put(Actions.Creators.pageLoaded(blocks));
}

export default function* pageSagas() {
  yield all([takeEvery(Actions.Types.LOAD_PAGE, loadPage)]);
}
