import Immutable, { ImmutableObject } from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Actions, { SetRealtedProductsAction, SetProductAction } from './actions';
import { Product } from '../shared/interfaces/product';

export interface ProductState {
  product: Product | {};
  relatedProducts: Product[];
}

type Actions = SetProductAction & SetRealtedProductsAction;

export type ImmutableProductState = ImmutableObject<ProductState>;

export const INITIAL_STATE = Immutable({
  product: {},
  relatedProducts: []
});

const setProduct = (
  state: ImmutableProductState,
  { product }: SetProductAction
): ImmutableProductState => state.set('product', product);

const setRelatedProducts = (
  state: ImmutableProductState,
  { relatedProducts }: SetRealtedProductsAction
): ImmutableProductState => state.set('relatedProducts', relatedProducts);

export const HANDLERS = {
  [Actions.Types.SET_PRODUCT]: setProduct,
  [Actions.Types.SET_RELATED_PRODUCTS]: setRelatedProducts
};

export default createReducer<ImmutableProductState, Actions>(
  INITIAL_STATE,
  HANDLERS
);
