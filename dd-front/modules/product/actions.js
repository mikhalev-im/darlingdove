import { createActions } from 'reduxsauce';

export default createActions({
  loadProductPage: ['id'],
  setProduct: ['product'],
  setRelatedProducts: ['relatedProducts'],
  productPageLoaded: null
});
