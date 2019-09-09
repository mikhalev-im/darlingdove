import { createSelector } from 'reselect';

export const getCategory = state => state.category;

export const getProducts = createSelector(
  getCategory,
  cart => cart.products
);

export const getProductsCount = createSelector(
  getProducts,
  products => products.count
);

export const getProductsData = createSelector(
  getProducts,
  products => products.data
);

export const getTags = createSelector(
  getCategory,
  cart => cart.tags
);
