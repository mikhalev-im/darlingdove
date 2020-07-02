import { all, takeEvery, put, select } from 'redux-saga/effects';

import Actions, { LoadLoginPageAction } from './actions';
import RootActions from '../root/actions';
import { getUserId } from '../user/selectors';

const DEFAULT_REDIRECT = '/profile';

export function* loadLoginPage({ res, query }: LoadLoginPageAction) {
  const redirectDestination = query.redirect || DEFAULT_REDIRECT;

  const userId = yield select(getUserId);
  if (userId) {
    // redirect if user alredy logged in
    yield put(RootActions.Creators.redirect(redirectDestination, res));
  }

  // resolve waitFor promise
  yield put(Actions.Creators.loginPageLoaded(null, redirectDestination));
}

export default function* loginSagas() {
  yield all([takeEvery(Actions.Types.LOAD_LOGIN_PAGE, loadLoginPage)]);
}
