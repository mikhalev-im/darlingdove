import { createSelector } from 'reselect';

export const getOrderState = state => state.order;

export const getOrder = createSelector(
  getOrderState,
  order => order.order
);
