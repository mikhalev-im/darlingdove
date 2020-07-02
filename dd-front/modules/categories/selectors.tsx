import { createSelector } from 'reselect';

export const getCategory = state => state.category;

export const getCategoryProducts = createSelector(
  getCategory,
  category => category.products
);

export const getCategoryProductsCount = createSelector(
  getCategoryProducts,
  products => products.count
);

export const getCategoryProductsData = createSelector(
  getCategoryProducts,
  products => products.data
);

export const getCategoryTags = createSelector(
  getCategory,
  category => category.tags
);
