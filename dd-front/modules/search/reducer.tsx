import Immutable, { ImmutableObject } from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Actions, { SetSearchProducts } from './actions';
import { Product } from '../shared/interfaces/product';

interface SearchState {
  products: {
    count: number;
    data: Product[];
  };
}

export type ImmutableSearchState = ImmutableObject<SearchState>;

export const INITIAL_STATE = Immutable({
  products: {
    count: 0,
    data: []
  }
});

const setSearchProducts = (
  state: ImmutableSearchState,
  { products }: SetSearchProducts
) => state.set('products', products);

export const HANDLERS = {
  [Actions.Types.SET_SEARCH_PRODUCTS]: setSearchProducts
};

export default createReducer(INITIAL_STATE, HANDLERS);
