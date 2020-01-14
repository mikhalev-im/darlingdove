import { createSelector } from 'reselect';

export const getSearch = state => state.search;

export const getProducts = createSelector(
  getSearch,
  category => category.products
);

export const getProductsCount = createSelector(
  getProducts,
  products => products.count
);

export const getProductsData = createSelector(
  getProducts,
  products => products.data
);
