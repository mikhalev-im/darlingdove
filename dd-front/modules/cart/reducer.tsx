import Immutable, { ImmutableObject } from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Actions, {
  SetCartIdAction,
  SetCartAction,
  DebouncedCartQtyUpdate
} from './actions';
import { CartItem } from '../shared/interfaces/cart-item';
import { Promocode } from '../shared/interfaces/promocode';
import { Service } from '../shared/interfaces/service';

interface CartState {
  _id: string | null;
  items: CartItem[];
  services: Service[];
  promocodes: Promocode[];
}

export type ImmutableCartState = ImmutableObject<CartState>;

export const INITIAL_STATE = Immutable({
  _id: null,
  items: [],
  services: [],
  promocodes: []
});

const setCartId = (state: ImmutableCartState, { cartId }: SetCartIdAction) =>
  state.set('_id', cartId);
const resetCartItems = (state: ImmutableCartState) =>
  state
    .set('items', [])
    .set('promocodes', [])
    .set('services', []);

const setCart = (state: ImmutableCartState, { cart }: SetCartAction) =>
  state
    .set('items', cart.items)
    .set('services', cart.services)
    .set('promocodes', cart.promocodes)
    .set('_id', cart._id || state._id);

const changeQty = (
  state: ImmutableCartState,
  { productId, qty }: DebouncedCartQtyUpdate
) =>
  state.set(
    'items',
    state.items.map(item => {
      return productId === item.product._id
        ? item.set('qty', Number(qty))
        : item;
    })
  );

type Actions = SetCartIdAction & SetCartAction & DebouncedCartQtyUpdate;

export const HANDLERS = {
  [Actions.Types.SET_CART]: setCart,
  [Actions.Types.SET_CART_ID]: setCartId,
  [Actions.Types.RESET_CART_ITEMS]: resetCartItems,
  [Actions.Types.DEBOUNCED_CART_QTY_UPDATE]: changeQty
};

export default createReducer<ImmutableCartState, Actions>(
  INITIAL_STATE,
  HANDLERS
);
