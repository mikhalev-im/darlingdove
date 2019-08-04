import { all, call, takeEvery } from 'redux-saga/effects';
import Router from 'next/router';

import Actions from './actions';

const serverSideRedirect = (res, redirectTo) => {
  res.writeHead(302, { Location: redirectTo });
  res.end();
};

export function* redirect({ redirectTo, res = null }) {
  if (!res) {
    yield call([Router, 'push'], redirectTo);
    return;
  }

  yield call(serverSideRedirect, res, redirectTo);
}

export default function* rootSaga() {
  yield all([takeEvery(Actions.Types.REDIRECT, redirect)]);
}
