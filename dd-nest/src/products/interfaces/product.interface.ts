import { Document } from 'mongoose';

interface ProductImage {
  readonly width: number;
  readonly height: number;
  readonly type: string;
  readonly url: string;
}

export interface Product extends Document {
  readonly name: string;
  readonly description: string;
  readonly sku: string;
  qty: number;
  readonly price: number;
  readonly oldPrice: number;
  readonly images: ProductImage[];
  readonly ordersNumber: number;
  readonly tags: string[];
  readonly category: string;
  readonly createdTime: Date;
  readonly updatedTime: Date;
}
