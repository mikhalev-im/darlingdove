import { all, takeEvery, put, call } from 'redux-saga/effects';

import Actions, { LoadPageAction } from './actions';
import { getPage } from '../shared/utils/api';

export function* loadPage({ query, res }: LoadPageAction) {
  try {
    const { blocks } = yield call(getPage, query.slug);
    yield put(Actions.Creators.pageLoaded(null, blocks));
  } catch (err) {
    yield put(Actions.Creators.pageLoaded(err));
  }
}

export default function* pageSagas() {
  yield all([takeEvery(Actions.Types.LOAD_PAGE, loadPage)]);
}
