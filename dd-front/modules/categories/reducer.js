import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Actions from './actions';

const PRODUCTS_PER_PAGE = 50;

export const INITIAL_STATE = Immutable({
  tags: [],
  products: {
    count: 0,
    data: []
  },
  filters: {
    orderBy: 'createdTime',
    order: 'desc',
    limit: PRODUCTS_PER_PAGE,
    skip: 0,
    inStock: true
  }
});

const setCategoryTags = (state, { tags }) => state.set('tags', tags);
const setCategoryProducts = (state, { products }) =>
  state.set('products', products);
const setCategoryFilters = (state, { filters }) =>
  state.set('filters', filters);

export const HANDLERS = {
  [Actions.Types.SET_CATEGORY_TAGS]: setCategoryTags,
  [Actions.Types.SET_CATEGORY_PRODUCTS]: setCategoryProducts,
  [Actions.Types.SET_CATEGORY_FILTERS]: setCategoryFilters
};

export default createReducer(INITIAL_STATE, HANDLERS);
