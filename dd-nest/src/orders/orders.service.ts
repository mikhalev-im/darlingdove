import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './interfaces/order.interface';

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
}
