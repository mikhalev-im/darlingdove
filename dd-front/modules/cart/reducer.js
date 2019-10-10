import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Actions from './actions';

export const INITIAL_STATE = Immutable({
  _id: null,
  items: [],
  services: [],
  promocodes: []
});

const setCartId = (state, { cartId }) => state.set('_id', cartId);
const resetCartItems = state => state.set('items', []);
const setCart = (state, { cart }) =>
  state
    .set('items', cart.items)
    .set('services', cart.services)
    .set('promocodes', cart.promocodes)
    .set('_id', cart._id || state._id);

const changeQty = (state, { productId, qty }) =>
  state.set(
    'items',
    state.items.map(item => {
      return productId === item.product._id
        ? item.set('qty', Number(qty))
        : item;
    })
  );

export const HANDLERS = {
  [Actions.Types.SET_CART]: setCart,
  [Actions.Types.SET_CART_ID]: setCartId,
  [Actions.Types.RESET_CART_ITEMS]: resetCartItems,
  [Actions.Types.DEBOUNCED_CART_QTY_UPDATE]: changeQty
};

export default createReducer(INITIAL_STATE, HANDLERS);
