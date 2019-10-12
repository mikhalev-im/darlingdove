import { Document, Types } from 'mongoose';
import { Discount, Promocode } from 'promocodes/interfaces/promocode.interface';
import { Product } from 'products/interfaces/product.interface';

export interface CartItem {
  product: Types.ObjectId | Product;
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
  promocode: Types.ObjectId | Promocode;
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
  calcDelivery(): Promise<number>;
}
