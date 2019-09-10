import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Actions from './actions';

export const INITIAL_STATE = Immutable({
  product: {},
  relatedProducts: []
});

const setProduct = (state, { product }) => state.set('product', product);

const setRelatedProducts = (state, { relatedProducts }) =>
  state.set('relatedProducts', relatedProducts);

export const HANDLERS = {
  [Actions.Types.SET_PRODUCT]: setProduct,
  [Actions.Types.SET_RELATED_PRODUCTS]: setRelatedProducts
};

export default createReducer(INITIAL_STATE, HANDLERS);
