import { createActions } from 'reduxsauce';

interface CheckoutTypes {
  CHANGE_STEP: 'CHANGE_STEP';
  CREATE_ORDER_AND_PAY: 'CREATE_ORDER_AND_PAGE';
  SAVE_USER_AND_CHANGE_STEP: 'SAVE_USER_AND_CHANGE_STEP';
  LOAD_CHECKOUT_PAGE: 'LOAD_CHECKOUT_PAGE';
  CHECKOUT_PAGE_LOADED: 'CHECKOUT_PAGE_LOADED';
}

export interface ChangeStepAction {
  type: 'CHANGE_STEP';
  step: number;
}

export interface CreateOrderAndPayAction {
  type: 'CREATE_ORDER_AND_PAGE';
  comment: string;
}

export interface UserData {
  firstName: string;
  lastName: string;
  country: string;
  postalCode: string;
  address: string;
}

export interface SaveUserAndChangeStepAction {
  type: 'SAVE_USER_AND_CHANGE_STEP';
  data: UserData;
}

export interface LoadCheckoutPageAction {
  type: 'LOAD_CHECKOUT_PAGE';
  res: any;
}

export interface CheckoutPageLoaded {
  type: 'CHECKOUT_PAGE_LOADED';
  error?: any;
}

interface CheckoutActionCreators {
  changeStep(step: number): ChangeStepAction;
  createOrderAndPay(comment: string): CreateOrderAndPayAction;
  saveUserAndChangeStep(data: UserData): SaveUserAndChangeStepAction;
  loadCheckoutPage(res: any): LoadCheckoutPageAction;
  checkoutPageLoaded(error?: any): CheckoutPageLoaded;
}

export default createActions<CheckoutTypes, CheckoutActionCreators>({
  changeStep: ['step'],
  createOrderAndPay: ['comment'],
  saveUserAndChangeStep: ['data'],
  loadCheckoutPage: ['res'],
  checkoutPageLoaded: ['error']
});
