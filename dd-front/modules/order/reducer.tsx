import Immutable, { ImmutableObject } from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Actions, { SetOrderAction } from './actions';
import { Order } from '../shared/interfaces/order';

export interface OrderState {
  order: Order | null;
}

export type ImmutableOrderState = ImmutableObject<OrderState>;

export const INITIAL_STATE = Immutable({
  order: null
});

const setOrder = (state: ImmutableOrderState, { order }: SetOrderAction) =>
  state.set('order', order);

export const HANDLERS = {
  [Actions.Types.SET_ORDER]: setOrder
};

export default createReducer(INITIAL_STATE, HANDLERS);
