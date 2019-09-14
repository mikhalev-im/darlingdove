import { createActions } from 'reduxsauce';

export default createActions({
  changeStep: ['step'],
  createOrderAndPay: ['comment'],
  saveUserAndChangeStep: ['data'],
  loadCheckoutPage: ['res'],
  checkoutPageLoaded: null
});
