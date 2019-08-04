import { Document } from 'mongoose';

import { GetProductsDto } from '../../products/dto/get-products.dto';

export enum PageBlockTypes {
  Products = 'products',
  Banner = 'banner',
}

interface PageBlock {
  readonly type: PageBlockTypes;
  readonly title?: string;
  readonly src?: string;
  readonly filter?: GetProductsDto;
  data?: object;
}

export interface Page extends Document {
  readonly slug: string;
  blocks: PageBlock[];
  readonly createdTime: Date;
  readonly updatedTime: Date;
}
