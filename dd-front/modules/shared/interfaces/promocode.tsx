export enum PromocodeDiscountType {
  fixed = 'fixed',
  percent = 'percent'
}

export interface PromocodeDiscount {
  type: PromocodeDiscountType;
  amount: number;
  total: number;
}

export interface Promocode {
  promocode: string;
  code: string;
  discount: PromocodeDiscount;
  minSum?: number;
}
