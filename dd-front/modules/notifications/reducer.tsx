import Immutable, { ImmutableObject } from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Actions, {
  AddNotificationAction,
  CloseNotificationAction,
  ProcessNotificationsAction
} from './actions';
import { NotificationData } from '../shared/components/layout/notifications';

export interface NotificationsState {
  open: boolean;
  queue: NotificationData[];
  messageData: NotificationData | {};
}

type Actions = AddNotificationAction &
  CloseNotificationAction &
  ProcessNotificationsAction;

export type ImmutableNotificationsState = ImmutableObject<NotificationsState>;

export const INITIAL_STATE = Immutable({
  open: false,
  queue: [],
  messageData: {}
});

const addNotification = (
  state: ImmutableNotificationsState,
  { data }: AddNotificationAction
) => state.set('queue', [...state.queue.asMutable(), data]).set('open', false);

const closeNotification = (state: ImmutableNotificationsState) =>
  state.set('open', false);

const processNotifications = (state: ImmutableNotificationsState) => {
  if (state.queue.length === 0) return state;
  const [messageData, ...newQueue] = state.queue.asMutable();
  return state
    .set('messageData', messageData)
    .set('open', true)
    .set('queue', newQueue);
};

export const HANDLERS = {
  [Actions.Types.ADD_NOTIFICATION]: addNotification,
  [Actions.Types.CLOSE_NOTIFICATION]: closeNotification,
  [Actions.Types.PROCESS_NOTIFICATIONS]: processNotifications
};

export default createReducer<ImmutableNotificationsState, Actions>(
  INITIAL_STATE,
  HANDLERS
);
