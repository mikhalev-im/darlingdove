import { createSelector } from 'reselect';

export const getCheckout = state => state.checkout;

export const getStep = createSelector(
  getCheckout,
  checkout => checkout.step
);
