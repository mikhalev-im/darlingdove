import { Document } from 'mongoose';

export enum DiscountType {
  fixed = 'fixed',
  percent = 'percent',
}

export interface Discount {
  type: DiscountType;
  amount: number;
}

interface Limitations {
  usagePerUser?: number;
  totalUsage?: number;
  minSum?: number;
}

export interface Promocode extends Document {
  readonly code: string;
  readonly discount: Discount;
  readonly limitations: Limitations;
  readonly startTime: Date;
  readonly endTime: Date;
  readonly createdTime: Date;
}
