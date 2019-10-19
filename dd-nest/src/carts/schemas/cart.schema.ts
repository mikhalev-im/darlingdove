import * as mongoose from 'mongoose';

import { FREE_DELIVERY_THRESHOLD, PAID_DELIVERY_PRICE } from '../constants';
import {
  Service,
  ServiceTypes,
  CartPromocode,
} from '../interfaces/cart.interface';
import { DiscountType } from 'promocodes/interfaces/promocode.interface';

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
  promocodes: [
    {
      promocode: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Promocode',
      },
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
        total: {
          type: Number,
          required: true,
        },
      },
      minSum: {
        type: Number,
        required: false,
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
  // no delivery if there are no items
  if (!this.items.length) {
    this.services = [];
    return;
  }

  // populate products if not already
  if (!this.populated('items.product')) {
    await this.populate('items.product').execPopulate();
  }

  // calc the sum of items
  let sum = this.items.reduce((result: number, item) => {
    result += item.qty * item.product.price;
    return result;
  }, 0);

  // apply promocodes
  sum = this.promocodes.reduce((result: number, promo: CartPromocode) => {
    // TODO: order of promocodes will matter, fix this
    if (promo.minSum && result < promo.minSum) {
      promo.discount.total = 0;
      return result;
    }

    const discount =
      promo.discount.type === DiscountType.fixed
        ? promo.discount.amount
        : Math.floor((result / 100) * promo.discount.amount);

    promo.discount.total = result >= discount ? discount : result;

    return result - promo.discount.total;
  }, sum);

  this.services = this.services || [];

  // remove old deliveries
  this.services = this.services.filter(
    (service: Service) =>
      ![ServiceTypes.FreeDelivery, ServiceTypes.PaidDelivery].includes(
        service.type,
      ),
  );

  const delivery =
    sum < FREE_DELIVERY_THRESHOLD
      ? { type: ServiceTypes.PaidDelivery, price: PAID_DELIVERY_PRICE }
      : { type: ServiceTypes.FreeDelivery, price: 0 };

  // push new delivery
  this.services.push(delivery);

  return sum + delivery.price;
});
