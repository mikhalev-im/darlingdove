import { createActions } from 'reduxsauce';
import { Product } from '../shared/interfaces/product';

export interface SearchTypes {
  readonly LOAD_SEARCH_PAGE: 'LOAD_SEARCH_PAGE';
  readonly SET_SEARCH_PRODUCTS: 'SET_SEARCH_PRODUCTS';
  readonly SEARCH_PAGE_LOADED: 'SEARCH_PAGE_LOADED';
}

export interface LoadSearchPage {
  readonly type: 'LOAD_SEARCH_PAGE';
  readonly query: any;
}

export interface SetSearchProducts {
  readonly type: 'LOAD_SEARCH_PAGE';
  readonly products: { count: number; products: Product[] };
}

export interface SearchPageLoaded {
  readonly type: 'SEARCH_PAGE_LOADED';
  readonly error?: any;
  readonly query?: any;
}

export interface SearchQuery {
  search?: string;
  skip?: number;
}

interface SearchActionCreators {
  loadSearchPage(query: SearchQuery): LoadSearchPage;
  setSearchProducts(products: {
    count: number;
    products: Product[];
  }): SetSearchProducts;
  searchPageLoaded(error?: any, query?: SearchQuery): SearchPageLoaded;
}

export default createActions<SearchTypes, SearchActionCreators>({
  loadSearchPage: ['query'],
  setSearchProducts: ['products'],
  searchPageLoaded: ['error', 'query']
});
