import { createSelector } from 'reselect';

export const getUser = state => state.user;

export const getUserId = createSelector(
  getUser,
  user => user._id
);

export const getToken = createSelector(
  getUser,
  user => user.jwt
);
