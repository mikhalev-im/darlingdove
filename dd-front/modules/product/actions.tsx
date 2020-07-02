import { createActions } from 'reduxsauce';
import { Product } from '../shared/interfaces/product';

interface ProductTypes {
  LOAD_PRODUCT_PAGE: string;
  SET_PRODUCT: string;
  SET_RELATED_PRODUCTS: string;
  PRODUCT_PAGE_LOADED: string;
}

export interface LoadProductPageAction {
  type: 'LOAD_PRODUCT_PAGE';
  sku: string;
  res: any;
}

export interface SetProductAction {
  type: 'SET_PRODUCT';
  product: Product;
}

export interface SetRealtedProductsAction {
  type: 'SET_RELATED_PRODUCTS';
  relatedProducts: Product[];
}

export interface ProductPageLoadedAction {
  type: 'PRODUCT_PAGE_LOADED';
  error?: any;
}

interface ProductActionCreators {
  loadProductPage(sku: string, res: any): LoadProductPageAction;
  setProduct(product: Product): SetProductAction;
  setRelatedProducts(relatedProducts: Product[]): SetRealtedProductsAction;
  productPageLoaded(error?: any): ProductPageLoadedAction;
}

export default createActions<ProductTypes, ProductActionCreators>({
  loadProductPage: ['sku', 'res'],
  setProduct: ['product'],
  setRelatedProducts: ['relatedProducts'],
  productPageLoaded: ['error']
});
