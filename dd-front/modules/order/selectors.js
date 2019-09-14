import { createSelector } from 'reselect';

export const getOrderState = state => state.order;

export const getOrder = createSelector(
  getOrderState,
  checkout => checkout.step
);
