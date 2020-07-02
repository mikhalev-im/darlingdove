import { Product } from './product';
import { Promocode } from './promocode';
import { Service } from './service';

export interface OrderItem {
  qty: number;
  price: number;
  product: string | Product;
}

export interface PopulatedOrderItem extends OrderItem {
  product: Product;
}

export interface OrderUser {
  _id: string;
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  postalCode: string;
}

export enum OrderStatus {
  notPaid = 'notPaid',
  paid = 'paid',
  shipped = 'shipped',
  done = 'done'
}

export interface Order {
  _id: string;
  items: OrderItem[];
  services: Service[];
  promocodes: Promocode[];
  total: number;
  user: OrderUser;
  comment?: string;
  shortId: string;
  status: OrderStatus;
  trackingNumber?: string;
  createdTime: string;
  updatedTime?: string;
}

export interface PopulatedOrder extends Order {
  items: PopulatedOrderItem[];
}
