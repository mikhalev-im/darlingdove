import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Actions from './actions';

export const INITIAL_STATE = Immutable({
  products: {
    count: 0,
    data: []
  }
});

const setSearchProducts = (state, { products }) =>
  state.set('products', products);

export const HANDLERS = {
  [Actions.Types.SET_SEARCH_PRODUCTS]: setSearchProducts
};

export default createReducer(INITIAL_STATE, HANDLERS);
