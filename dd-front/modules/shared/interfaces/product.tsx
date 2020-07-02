export enum ProductImageType {
  CARD = 'card',
  BIG = 'big'
}

export interface ProductImage {
  type: ProductImageType;
  url: string;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  images: ProductImage[];
  price: number;
  oldPrice?: number;
  qty: number;
  description: string;
  tags: string[];
  category: string;
}
