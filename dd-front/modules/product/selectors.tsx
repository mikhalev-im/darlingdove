import { createSelector } from 'reselect';

export const getProductPage = state => state.product;

export const getProduct = createSelector(
  getProductPage,
  productPage => productPage.product
);

export const getRelatedProducts = createSelector(
  getProductPage,
  productPage => productPage.relatedProducts
);
