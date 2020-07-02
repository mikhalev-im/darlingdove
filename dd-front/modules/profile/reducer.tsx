import Immutable, { ImmutableObject } from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Actions, { SetOrdersAction } from './actions';
import { Order } from '../shared/interfaces/order';

export interface ProfileState {
  orders: Order[];
}

export type ImmutableProfileState = ImmutableObject<ProfileState>;

export const INITIAL_STATE = Immutable({
  orders: []
});

const setOrders = (state: ImmutableProfileState, { orders }: SetOrdersAction) =>
  state.set('orders', orders);

export const HANDLERS = {
  [Actions.Types.SET_ORDERS]: setOrders
};

export default createReducer<ImmutableProfileState, SetOrdersAction>(
  INITIAL_STATE,
  HANDLERS
);
