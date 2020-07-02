import { createActions } from 'reduxsauce';
import { Product } from '../shared/interfaces/product';
import { Promocode } from '../shared/interfaces/promocode';
import { Service } from '../shared/interfaces/service';

interface CartTypes {
  readonly SET_CART_ID: 'SET_CART_ID';
  readonly SET_CART: 'SET_CART';
  readonly ADD_TO_CART: 'ADD_TO_CART';
  readonly ADD_PROMOCODE: 'ADD_PROMOCODE';
  readonly REMOVE_FROM_CART: 'REMOVE_FROM_CART';
  readonly RESET_CART_ITEMS: 'RESET_CART_ITEMS';
  readonly UPDATE_CART_ITEMS_QTY: 'UPDATE_CART_ITEMS_QTY';
  readonly DEBOUNCED_CART_QTY_UPDATE: 'DEBOUNCED_CART_QTY_UPDATE';
}

export interface SetCartIdAction {
  readonly type: 'SET_CART_ID';
  readonly cartId: string;
}

export interface SetCartAction {
  readonly type: 'SET_CART';
  readonly cart: {
    _id: string;
    items: Product[];
    services: Service[];
    promocodes: Promocode[];
  };
}

export interface AddToCartAction {
  readonly type: 'ADD_TO_CART';
  readonly productId: string;
  readonly qty: number;
}

export interface AddPromocodeAction {
  readonly type: 'ADD_PROMOCODE';
  readonly code: string;
}

export interface RemoveFromCartAction {
  readonly type: 'REMOVE_FROM_CART';
  readonly productId: string;
}

export interface ResetCartItemsAction {
  readonly type: 'RESET_CART_ITEMS';
}

export interface UpdateCartItemsQtyAction {
  readonly type: 'UPDATE_CART_ITEMS_QTY';
}

export interface DebouncedCartQtyUpdate {
  readonly type: 'DEBOUNCED_CART_QTY_UPDATE';
  readonly productId: string;
  readonly qty: number;
}

interface CartActionCreators {
  setCartId(cartId: string): SetCartIdAction;
  setCart(cart: object): SetCartAction;
  addToCart(productId: string, qty: number): AddToCartAction;
  addPromocode(code: string): AddPromocodeAction;
  removeFromCart(productId: string): RemoveFromCartAction;
  resetCartItems(): ResetCartItemsAction;
  updateCartItemsQty(): UpdateCartItemsQtyAction;
  debouncedCartQtyUpdate(
    productId: string,
    qty: number
  ): DebouncedCartQtyUpdate;
}

export default createActions<CartTypes, CartActionCreators>({
  setCartId: ['cartId'],
  setCart: ['cart'],
  addToCart: ['productId', 'qty'],
  addPromocode: ['code'],
  removeFromCart: ['productId'],
  resetCartItems: null,
  updateCartItemsQty: null,
  debouncedCartQtyUpdate: ['productId', 'qty']
});
