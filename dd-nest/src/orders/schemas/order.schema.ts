import * as mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema({
  items: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
      qty: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    _id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    firstName: String,
    lastName: String,
    address: String,
    country: String,
    postalCode: String,
  },
  paymentRequests: [
    {
      status: String,
      requestId: String,
      createdTime: Date,
    },
  ],
  comment: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['notPaid', 'paid', 'shipped', 'done'],
  },
  trackingNumber: {
    type: String,
    required: false,
  },
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
