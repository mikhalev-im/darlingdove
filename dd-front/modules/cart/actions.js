import { createActions } from 'reduxsauce';

export default createActions({
  setCartId: ['cartId'],
  setCart: ['cart'],
  addToCart: ['productId', 'qty'],
  addPromocode: ['code'],
  removeFromCart: ['productId'],
  resetCartItems: null,
  updateCartItemsQty: null,
  debouncedCartQtyUpdate: ['productId', 'qty']
});
