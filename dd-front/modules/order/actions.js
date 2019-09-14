import { createActions } from 'reduxsauce';

export default createActions({
  setOrder: ['order'],
  loadOrderPage: ['query', 'res'],
  orderPageLoaded: null
});
