import { put, all, takeEvery } from 'redux-saga/effects';

import Actions from './actions';

export function* addNotification() {
  yield put(Actions.Creators.processNotifications());
}

export function* addErrorNotification() {}

// export const addNotification = notificationInfo => dispatch => {
//   dispatch({ type: ADD_NOTIFICATION, notificationInfo });
//   dispatch(processNotifications());
// };

// export const showErrorNotification = error => dispatch => {
//   const notificationInfo = {
//     key: error.message,
//     debug: error,
//     message: "Ошибка при выполнении действия"
//   };
//   dispatch({ type: ADD_NOTIFICATION, notificationInfo });
//   dispatch(processNotifications());
// };

export default function* notificationsSagas() {
  yield all([takeEvery(Actions.Types.ADD_NOTIFICATION, addNotification)]);
}
