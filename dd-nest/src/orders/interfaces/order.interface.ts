import { Document, Types } from 'mongoose';
import { CartPromocode, Service } from 'carts/interfaces/cart.interface';
import { Product } from 'products/interfaces/product.interface';

export enum OrderStatusTypes {
  NotPaid = 'notPaid',
  Paid = 'paid',
  Shipped = 'shipped',
  Done = 'done',
}

interface OrderItem {
  readonly product: Types.ObjectId | Product;
  readonly qty: number;
  readonly price: number;
}

interface User {
  readonly _id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly country: string;
  readonly postalCode: string;
  readonly address: string;
}

export interface Order extends Document {
  readonly items: OrderItem[];
  readonly services: Service[];
  readonly promocodes: CartPromocode[];
  readonly user: User;
  readonly total: number;
  shortId: string;
  status: OrderStatusTypes;
  comment: string;
  trackingNumber: string;
  updatedTime?: Date;
  readonly createdTime?: Date;
}
