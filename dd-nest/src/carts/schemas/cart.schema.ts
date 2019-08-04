import * as mongoose from 'mongoose';

import { FREE_DELIVERY_THRESHOLD, PAID_DELIVERY_PRICE } from '../constants';
import { Service, ServiceTypes } from '../interfaces/cart.interface';

export const CartSchema = new mongoose.Schema({
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
        min: 1,
      },
    },
  ],
  services: [
    {
      type: {
        type: String,
        required: true,
        enum: [ServiceTypes.PaidDelivery, ServiceTypes.FreeDelivery],
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
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

CartSchema.method('calcDelivery', async function() {
  // no delivery if no there are no items
  if (!this.items.length) {
    this.services = [];
    return;
  }

  // populate products if not already
  if (!this.populated('items.product')) {
    await this.populate('items.product').execPopulate();
  }

  // calc the sum
  const sum = this.items.reduce((result: number, item) => {
    result += item.qty * item.product.price;
    return result;
  }, 0);

  this.services = this.services || [];

  // remove old deliveries
  this.services = this.services.filter(
    (service: Service) =>
      ![ServiceTypes.FreeDelivery, ServiceTypes.PaidDelivery].includes(
        service.type,
      ),
  );

  // push new delivery
  this.services.push(
    sum < FREE_DELIVERY_THRESHOLD
      ? { type: ServiceTypes.PaidDelivery, price: PAID_DELIVERY_PRICE }
      : { type: ServiceTypes.FreeDelivery, price: 0 },
  );
});
