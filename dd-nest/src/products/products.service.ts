import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './interfaces/product.interface';
import { ProductMatch } from './interfaces/product-match.interface';
import { GetProductsDto } from './dto/get-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async findById(productId: string): Promise<Product> {
    return this.productModel.findById(productId).exec();
  }

  async findByIds(productIds: string[]): Promise<Product[]> {
    return this.productModel.find({ _id: { $in: productIds } }).exec();
  }

  async getRandom(count: number): Promise<Product[]> {
    return this.productModel.aggregate([{ $sample: { size: count } }]).exec();
  }

  buildMatch(filters: GetProductsDto): ProductMatch {
    const match: ProductMatch = {};

    if (filters.category) {
      match.category = filters.category;
    }

    if (filters.tagsOptional) {
      match.tags = Array.isArray(filters.tagsOptional)
        ? { $in: filters.tagsOptional }
        : { $in: [filters.tagsOptional] };
    }

    if (filters.tagsRequired) {
      match.tags = match.tags || {};
      match.tags.$all = Array.isArray(filters.tagsRequired)
        ? filters.tagsRequired
        : [filters.tagsRequired];
    }

    if (filters.inStock) match.qty = { $gt: 0 };

    return match;
  }

  async find(filters: GetProductsDto): Promise<Product[]> {
    const match = this.buildMatch(filters);
    const query = this.productModel.find(match);

    if (filters.orderBy) {
      const sortOrder = filters.order === 'asc' ? 1 : -1;
      query.sort({ [filters.orderBy]: sortOrder });
    }

    if (filters.limit) {
      query.limit(filters.limit);
    }

    if (filters.skip) {
      query.skip(filters.skip);
    }

    return query.exec();
  }

  async count(filters: GetProductsDto): Promise<number> {
    const match = this.buildMatch(filters);
    return this.productModel.count(match).exec();
  }

  async getTags(category?: string): Promise<string[]> {
    return this.productModel.distinct('tags', { category });
  }
}
