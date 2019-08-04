import { Document } from 'mongoose';

export interface CartItem {
  product: string;
  qty: number;
}

export enum ServiceTypes {
  FreeDelivery = 'FREE_DELIVERY',
  PaidDelivery = 'PAID_DELIVERY',
}

export interface Service {
  type: ServiceTypes;
  price: number;
}

export interface Cart extends Document {
  items: CartItem[];
  services: Service[];
  updatedTime: Date;
  readonly createdTime: Date;
  calcDelivery(): Promise<void>;
}
