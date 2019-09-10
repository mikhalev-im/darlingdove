import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Actions from './actions';

export const INITIAL_STATE = Immutable({
  orders: []
});

const setOrders = (state, { orders }) => state.set('orders', orders);

export const HANDLERS = {
  [Actions.Types.SET_ORDERS]: setOrders
};

export default createReducer(INITIAL_STATE, HANDLERS);
