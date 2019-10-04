import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Page } from './interfaces/page.interface';

@Injectable()
export class PagesService {
  constructor(@InjectModel('Page') private readonly pageModel: Model<Page>) {}

  async findBySlug(slug: string): Promise<Page> {
    return this.pageModel.findOne({ slug }).exec();
  }

  async loadAll(): Promise<Page[]> {
    return this.pageModel.find().exec();
  }
}
