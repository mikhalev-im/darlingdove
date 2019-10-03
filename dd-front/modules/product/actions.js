import { createActions } from 'reduxsauce';

export default createActions({
  loadProductPage: ['sku'],
  setProduct: ['product'],
  setRelatedProducts: ['relatedProducts'],
  productPageLoaded: null
});
