import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './interfaces/cart.interface';

@Injectable()
export class CartsService {
  constructor(@InjectModel('Cart') private readonly cartModel: Model<Cart>) {}

  async findById(cartId: string): Promise<Cart> {
    return this.cartModel.findById(cartId).exec();
  }

  async create(): Promise<Cart> {
    return this.cartModel.create({});
  }
}
