import { Document } from 'mongoose';
import { Discount } from 'promocodes/interfaces/promocode.interface';

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

export interface CartDiscount extends Discount {
  total?: number;
}

export interface CartPromocode {
  promocode: string;
  code: string;
  discount: CartDiscount;
  minSum?: number;
}

export interface Cart extends Document {
  items: CartItem[];
  services: Service[];
  promocodes: CartPromocode[];
  updatedTime: Date;
  readonly createdTime: Date;
  calcDelivery(): Promise<void>;
}
