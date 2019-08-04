import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Actions from './actions';

export const INITIAL_STATE = Immutable({
  open: false,
  queue: [],
  messageData: {}
});

const addNotification = (state, { data }) =>
  state.set('queue', [...state.queue, data]).set('open', false);

const closeNotification = state => state.set('open', false);

const processNotifications = state => {
  if (state.queue.length === 0) return state;
  const [messageData, ...newQueue] = state.queue;
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

export default createReducer(INITIAL_STATE, HANDLERS);
