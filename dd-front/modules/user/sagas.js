import { all, takeEvery, select, call, put } from 'redux-saga/effects';
import * as Cookie from 'js-cookie';

import api from '../shared/utils/api';
import Actions from './actions';
import { COOKIE } from '../../constants';
import { redirect } from '../root/sagas';
import { getToken, getUserId } from './selectors';
import NotificationsActions from '../notifications/actions';

// TODO: make routes constants
const DEFAULT_LOGIN_REDIRECT = '/profile';
const DEFAULT_LOGOUT_REDIRECT = '/';

// with error handling
// with loading indicator
export function* saveUserData({ data }) {
  // get user id from store
  const userId = yield select(getUserId);
  // get token from store
  const token = yield select(getToken);
  // make api request
  const user = yield call([api, 'patchUser'], token, userId, data);
  // set user in store
  yield put(Actions.Creators.setUser(user));
}

export function* setToken({ token }) {
  yield call([Cookie, 'set'], COOKIE.ACCESS_TOKEN, token);
  yield put(Actions.Creators.setToken(token));
}

// with error handling
// with loading indicator
export function* login({
  email,
  password,
  redirectTo = DEFAULT_LOGIN_REDIRECT
}) {
  const user = yield call([api, 'login'], email, password);
  yield put(Actions.Creators.setUser(user));
  yield call([Cookie, 'set'], COOKIE.ACCESS_TOKEN, user.jwt);
  yield call(redirect, { redirectTo });
}

// with error handling
// with loading indicator
export function* register({
  email,
  password,
  redirectTo = DEFAULT_LOGIN_REDIRECT
}) {
  const user = yield call([api, 'register'], email, password);
  yield put(Actions.Creators.setUser(user));
  yield call([Cookie, 'set'], COOKIE.ACCESS_TOKEN, user.jwt);
  yield call(redirect, { redirectTo });
}

export function* logout() {
  yield put(Actions.Creators.resetUser());
  yield call([Cookie, 'remove'], COOKIE.ACCESS_TOKEN);
  yield call(redirect, { redirectTo: DEFAULT_LOGOUT_REDIRECT });
}

export function* changePassword({ passwordOld, passwordNew }) {
  const userId = yield select(getUserId);
  const token = yield select(getToken);
  yield call([api, 'changePassword'], token, userId, {
    passwordOld,
    passwordNew
  });
  yield put(
    NotificationsActions.Creators.addNotification({
      key: 'userPasswordChanged',
      message: `Пароль изменен`
    })
  );
}

export default function* userSagas() {
  yield all([
    takeEvery(Actions.Types.SAVE_USER_DATA, saveUserData),
    takeEvery(Actions.Types.LOGIN, login),
    takeEvery(Actions.Types.REGISTER, register),
    takeEvery(Actions.Types.LOGOUT, logout),
    takeEvery(Actions.Types.CHANGE_PASSWORD, changePassword)
  ]);
}
