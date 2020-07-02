import { put, all, takeEvery } from 'redux-saga/effects';

import Actions from './actions';

export function* addNotification() {
  yield put(Actions.Creators.processNotifications());
}

export default function* notificationsSagas() {
  yield all([takeEvery(Actions.Types.ADD_NOTIFICATION, addNotification)]);
}
