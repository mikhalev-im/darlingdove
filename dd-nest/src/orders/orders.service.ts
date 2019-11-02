import * as https from 'https';
import { stringify } from 'querystring';
import { Types } from 'mongoose';

import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './interfaces/order.interface';
import { YANDEX_WALLET } from './constants';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
  ) {}

  async findById(orderId: string): Promise<Order> {
    return this.orderModel.findById(orderId).exec();
  }

  async findByUserAndPopulate(userId: string): Promise<Order[]> {
    return this.orderModel
      .find({ 'user._id': userId })
      .populate('items.product')
      .exec();
  }

  async create(order: object): Promise<Order> {
    return this.orderModel.create(order);
  }

  async countTotalPromocodeUsage(promocodeId: string): Promise<number> {
    return this.orderModel
      .find({ 'promocodes.promocode': promocodeId })
      .count();
  }

  async countPromocodeUsageByUser(
    promocodeId: string,
    userId: string,
  ): Promise<number> {
    return this.orderModel
      .find({ 'promocodes.promocode': promocodeId, 'user._id': userId })
      .count();
  }

  async createPayment(orderId: Types.ObjectId, sum: number): Promise<string> {
    const data = stringify({
      sum,
      label: orderId,
      receiver: YANDEX_WALLET,
      'quickpay-form': 'shop',
      paymentType: 'AC',
      successURL: `${process.env.BASE_URL}/profile`,
      targets: `DarlingDove Заказ №${orderId}`,
    });

    const options = {
      host: 'money.yandex.ru',
      port: 443,
      path: '/quickpay/confirm.xml',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length,
      },
    };

    return new Promise((resolve, reject) => {
      // request object
      const req = https.request(options, res => {
        res.on('data', () => {});
        res.on('end', () => resolve(res.headers.location));
        res.on('error', reject);
      });

      // req error
      req.on('error', reject);

      //send request witht the postData form
      req.write(data);
      req.end();
    });
  }
}
