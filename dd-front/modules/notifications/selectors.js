import { createSelector } from 'reselect';

export const getNotifications = state => state.notifications;

export const isNotificationOpen = createSelector(
  getNotifications,
  notifications => notifications.open
);

export const getMessageData = createSelector(
  getNotifications,
  notifications => notifications.messageData
);
