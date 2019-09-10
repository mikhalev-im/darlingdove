import { createSelector } from 'reselect';

export const getProfile = state => state.profile;

export const getOrders = createSelector(
  getProfile,
  profile => profile.orders
);
