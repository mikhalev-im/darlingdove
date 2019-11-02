import { createActions } from 'reduxsauce';

export default createActions({
  setOrder: ['order'],
  onPay: ['orderId'],
  loadOrderPage: ['query', 'res'],
  orderPageLoaded: ['error']
});
