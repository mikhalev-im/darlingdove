import { createActions } from 'reduxsauce';

export default createActions({
  loadProductPage: ['sku', 'res'],
  setProduct: ['product'],
  setRelatedProducts: ['relatedProducts'],
  productPageLoaded: null
});
