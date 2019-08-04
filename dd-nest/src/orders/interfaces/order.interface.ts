import { Document } from 'mongoose';
import { PaymentProcessStatus } from './yandex.interface';

export enum OrderStatusTypes {
  NotPaid = 'notPaid',
  Paid = 'paid',
  Shipped = 'shipped',
  Done = 'done',
}

interface OrderItem {
  readonly product: string;
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

interface PaymentRequest {
  requestId: string;
  status: PaymentProcessStatus;
  updatedTime?: Date;
  createdTime: Date;
}

export interface Order extends Document {
  readonly items: OrderItem[];
  readonly user: User;
  status: OrderStatusTypes;
  comment: string;
  trackingNumber: string;
  updatedTime?: Date;
  paymentRequests: PaymentRequest[];
  readonly createdTime?: Date;
}
