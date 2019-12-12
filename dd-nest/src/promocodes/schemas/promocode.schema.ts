import * as mongoose from 'mongoose';
import { DiscountType } from '../../promocodes/interfaces/promocode.interface';

export const PromocodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  discount: {
    type: {
      type: String,
      required: true,
      enum: [DiscountType.fixed, DiscountType.percent],
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  limitations: {
    perUser: {
      type: Number,
    },
    total: {
      type: Number,
    },
    minSum: {
      type: Number,
    },
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  createdTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
});
