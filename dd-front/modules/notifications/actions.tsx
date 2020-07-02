import { createActions } from 'reduxsauce';
import { NotificationData } from '../shared/components/layout/notifications';

interface NotificationTypes {
  readonly CLOSE_NOTIFICATION: 'CLOSE_NOTIFICATION';
  readonly PROCESS_NOTIFICATIONS: 'PROCESS_NOTIFICATIONS';
  readonly ADD_NOTIFICATION: 'ADD_NOTIFICATION';
}

export interface CloseNotificationAction {
  readonly type: 'CLOSE_NOTIFICATION';
}

export interface ProcessNotificationsAction {
  readonly type: 'PROCESS_NOTIFICATIONS';
}

export interface AddNotificationAction {
  readonly type: 'ADD_NOTIFICATION';
  readonly data: NotificationData;
}

interface NotificationActionCreators {
  closeNotification(): CloseNotificationAction;
  processNotifications(): ProcessNotificationsAction;
  addNotification(data: NotificationData): AddNotificationAction;
}

export default createActions<NotificationTypes, NotificationActionCreators>({
  closeNotification: null,
  processNotifications: null,
  addNotification: ['data']
});
