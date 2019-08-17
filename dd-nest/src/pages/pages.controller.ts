import {
  Controller,
  Param,
  Get,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { ApiUseTags, ApiOkResponse } from '@nestjs/swagger';
import { PageBlockTypes } from './interfaces/page.interface';
import { ProductsService } from '../products/products.service';

@ApiUseTags('pages')
@Controller('pages')
export class PagesController {
  constructor(
    private readonly pagesService: PagesService,
    @Inject(ProductsService) private readonly productsService: ProductsService,
  ) {}

  @Get(':slug')
  @ApiOkResponse({ description: 'Returns page object' })
  async getById(@Param('slug') slug: string) {
    const page = await this.pagesService.findBySlug(slug);

    if (!page) throw new HttpException('Page not found', HttpStatus.NOT_FOUND);

    const pageData = page.toObject();

    pageData.blocks = await Promise.all(
      pageData.blocks.map(async block => {
        if (block.type !== PageBlockTypes.Products) return block;

        block.data = await this.productsService.find(block.filter);
        block.data.map(product => product.toObject());
        return block;
      }),
    );

    return pageData;
  }
}
