import { Document } from 'mongoose';

export interface Product extends Document {
  readonly name: string;
  readonly sku: string;
  qty: number;
  readonly price: number;
  readonly oldPrice: number;
  readonly images: string[];
  readonly ordersNumber: number;
  readonly tags: string[];
  readonly category: string;
  readonly createdTime: Date;
  readonly updatedTime: Date;
}
