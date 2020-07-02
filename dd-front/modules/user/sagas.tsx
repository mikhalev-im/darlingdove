import { all, takeEvery, select, call, put } from 'redux-saga/effects';
import Cookie from 'js-cookie';

import * as api from '../shared/utils/api';
import Actions, {
  SaveUserDataAction,
  LoginAction,
  RegisterAction,
  ChangePasswordAction
} from './actions';
import { redirect } from '../root/sagas';
import { getUserId } from './selectors';
import NotificationsActions from '../notifications/actions';
import { COOKIE_TOKEN } from '../root/constants';

const DEFAULT_LOGIN_REDIRECT = '/profile';
const DEFAULT_LOGOUT_REDIRECT = '/';

const updateToken = (token: string) => {
  api.configure(token);
  Cookie.set(COOKIE_TOKEN, token, { expires: 30 });
};

export function* saveUserData({ data }: SaveUserDataAction) {
  try {
    // get user id from store
    const userId = yield select(getUserId);
    // make api request
    const user = yield call(api.patchUser, userId, data);
    // set user in store
    yield put(Actions.Creators.setUser(user));
  } catch (err) {
    yield put(
      NotificationsActions.Creators.addNotification({
        key: 'saveUserError',
        message: `Ошибка!`,
        debug: err
      })
    );
  }
}

export function* login({
  email,
  password,
  redirectTo = DEFAULT_LOGIN_REDIRECT
}: LoginAction) {
  try {
    const user = yield call(api.login, email, password);
    yield put(Actions.Creators.setUser(user));
    yield call(updateToken, user.jwt);
    yield call(redirect, { type: 'REDIRECT', redirectTo });
  } catch (err) {
    yield put(
      NotificationsActions.Creators.addNotification({
        key: 'loginError',
        message: `Ошибка!`,
        debug: err
      })
    );
  }
}

export function* register({
  email,
  password,
  redirectTo = DEFAULT_LOGIN_REDIRECT
}: RegisterAction) {
  try {
    const user = yield call(api.register, email, password);
    yield put(Actions.Creators.setUser(user));
    yield call(updateToken, user.jwt);
    yield call(redirect, { type: 'REDIRECT', redirectTo });
  } catch (err) {
    yield put(
      NotificationsActions.Creators.addNotification({
        key: 'registerError',
        message: `Ошибка!`,
        debug: err
      })
    );
  }
}

export function* logout() {
  try {
    yield put(Actions.Creators.resetUser());
    yield call(updateToken, '');
    yield call(redirect, {
      type: 'REDIRECT',
      redirectTo: DEFAULT_LOGOUT_REDIRECT
    });
  } catch (err) {
    yield put(
      NotificationsActions.Creators.addNotification({
        key: 'logoutError',
        message: `Ошибка!`,
        debug: err
      })
    );
  }
}

export function* changePassword({
  passwordOld,
  passwordNew
}: ChangePasswordAction) {
  try {
    const userId = yield select(getUserId);

    yield call(api.changePassword, userId, {
      passwordOld,
      passwordNew
    });

    yield put(
      NotificationsActions.Creators.addNotification({
        key: 'userPasswordChanged',
        message: `Пароль изменен`
      })
    );
  } catch (err) {
    yield put(
      NotificationsActions.Creators.addNotification({
        key: 'changePasswordError',
        message: `Ошибка!`,
        debug: err
      })
    );
  }
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
