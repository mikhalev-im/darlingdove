import { Product } from './product';

export interface CartItem {
  product: Product;
  qty: number;
}
