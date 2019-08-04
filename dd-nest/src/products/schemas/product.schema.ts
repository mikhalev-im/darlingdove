import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    default: 0,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  oldPrice: {
    type: Number,
    required: false,
    min: 0,
  },
  images: [String],
  ordersCount: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  tags: [String],
  category: String,
  updatedTime: {
    type: Date,
    required: false,
  },
  createdTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
});
