import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Actions from './actions';

export const INITIAL_STATE = Immutable({
  order: null
});

const setOrder = (state, { order }) => state.set('order', order);

export const HANDLERS = {
  [Actions.Types.SET_ORDER]: setOrder
};

export default createReducer(INITIAL_STATE, HANDLERS);
