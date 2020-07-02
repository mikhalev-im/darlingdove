import { createSelector } from 'reselect';

export const getRoot = state => state.root;

export const getModal = createSelector(getRoot, root => root.modal);

export const getIsLoading = createSelector(getRoot, root => root.isLoading);
