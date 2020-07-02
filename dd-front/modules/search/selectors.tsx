import { createSelector } from 'reselect';

export const getSearch = state => state.search;

export const getSearchProducts = createSelector(
  getSearch,
  category => category.products
);

export const getSearchProductsCount = createSelector(
  getSearchProducts,
  products => products.count
);

export const getSearchProductsData = createSelector(
  getSearchProducts,
  products => products.data
);
