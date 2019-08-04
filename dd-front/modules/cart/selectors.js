import { createSelector } from 'reselect';

export const getCart = state => state.cart;

export const getCartId = createSelector(
  getCart,
  cart => cart._id
);

export const getCartItems = createSelector(
  getCart,
  cart => cart.items
);

export const getCartServices = createSelector(
  getCart,
  cart => cart.services
);

export const getCartItemsQty = createSelector(
  getCartItems,
  items => items.reduce((sum, item) => sum + item.qty, 0)
);
