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

const setTags = (state, { tags }) => state.set('tags', tags);
const setProducts = (state, { products }) => state.set('products', products);
const setFilters = (state, { filters }) => state.set('filters', filters);

export const HANDLERS = {
  [Actions.Types.SET_TAGS]: setTags,
  [Actions.Types.SET_PRODUCTS]: setProducts,
  [Actions.Types.SET_FILTERS]: setFilters
};

export default createReducer(INITIAL_STATE, HANDLERS);
