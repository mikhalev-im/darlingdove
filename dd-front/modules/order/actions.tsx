import { createActions } from 'reduxsauce';
import { Order } from '../shared/interfaces/order';

interface OrderTypes {
  SET_ORDER: string;
  ON_PAY: string;
  LOAD_ORDER_PAGE: string;
  ORDER_PAGE_LOADED: string;
}

export interface SetOrderAction {
  type: 'SET_ORDER';
  order: Order;
}

export interface OnPayAction {
  type: 'ON_PAGE';
  orderId: string;
}

export interface LoadOrderPageAction {
  type: 'LOAD_ORDER_PAGE';
  query: any;
  res: any;
}

export interface OrderPageLoaded {
  type: 'ORDER_PAGE_LOADED';
  error?: any;
}

interface OrderActionCreators {
  setOrder(order: Order): SetOrderAction;
  onPay(orderId: string): OnPayAction;
  loadOrderPage(query: any, res: any): LoadOrderPageAction;
  orderPageLoaded(error?: any): OrderPageLoaded;
}

export default createActions<OrderTypes, OrderActionCreators>({
  setOrder: ['order'],
  onPay: ['orderId'],
  loadOrderPage: ['query', 'res'],
  orderPageLoaded: ['error']
});
