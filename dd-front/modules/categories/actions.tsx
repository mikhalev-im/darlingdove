import { createActions } from 'reduxsauce';
import { Product } from '../shared/interfaces/product';

interface CategoryTypes {
  readonly LOAD_CATEGORY_PAGE: 'LOAD_CATEGORY_PAGE';
  readonly SET_CATEGORY_TAGS: 'SET_CATEGORY_TAGS';
  readonly SET_CATEGORY_PRODUCTS: 'SET_CATEGORY_PRODUCTS';
  readonly SET_CATEGORY_FILTERS: 'SET_CATEGORY_FILTERS';
  readonly CATEGORY_PAGE_LOADED: 'CATEGORY_PAGE_LOADED';
}

export interface LoadCategoryPageAction {
  readonly type: 'LOAD_CATEGORY_PAGE';
  readonly query: any;
  readonly res: any;
}

export interface SetCategoryTagsAction {
  readonly type: 'SET_CATEGORY_TAGS';
  readonly tags: string[];
}

export interface SetCategoryProductsAction {
  readonly type: 'SET_CATEGORY_PRODUCTS';
  readonly products: Product[];
}

export interface SetCategoryFiltersAction {
  readonly type: 'SET_CATEGORY_FILTERS';
  readonly filters: object;
}

export interface CategoryPageLoadedAction {
  readonly type: 'CATEGORY_PAGE_LOADED';
  readonly error?: any;
  readonly query?: any;
}

interface CategoryActionCreators {
  loadCategoryPage(query: any, res: any): LoadCategoryPageAction;
  setCategoryTags(tags: string[]): SetCategoryTagsAction;
  setCategoryProducts(products: Product[]): SetCategoryProductsAction;
  setCategoryFilters(filters: object): SetCategoryFiltersAction;
  categoryPageLoaded(error?: any, query?: any): CategoryPageLoadedAction;
}

export default createActions<CategoryTypes, CategoryActionCreators>({
  loadCategoryPage: ['query', 'res'],
  setCategoryTags: ['tags'],
  setCategoryProducts: ['products'],
  setCategoryFilters: ['filters'],
  categoryPageLoaded: ['error', 'query']
});
