import {
  Controller,
  Param,
  Get,
  HttpException,
  HttpStatus,
  Query,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  Inject,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ParseIntValuesPipe } from '../shared/pipes/parse-int-values.pipe';
import { ParseBoolValuesPipe } from '../shared/pipes/parse-bool-values.pipe';
import { DefaultValuesPipe } from '../shared/pipes/default-values.pipe';
import { ApiUseTags, ApiOkResponse, ApiImplicitQuery } from '@nestjs/swagger';
import { GetProductsDto } from './dto/get-products.dto';

@ApiUseTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('random')
  @ApiImplicitQuery({
    name: 'count',
    required: false,
    description: 'Number of products to return',
  })
  @UsePipes(
    new DefaultValuesPipe({
      count: '1',
    }),
  )
  @ApiOkResponse({ description: 'Returns random products from db' })
  async getRandomProducts(@Query('count', new ParseIntPipe()) count) {
    return this.productsService.getRandom(count);
  }

  @Get('/tags')
  @ApiOkResponse({ description: 'Returns all possible tags for products' })
  async getTags(@Query('category') category: string) {
    return this.productsService.getTags(category);
  }

  @Get(':productId')
  @ApiOkResponse({ description: 'Returns product object' })
  async getById(@Param('productId') productId: string) {
    const product = await this.productsService.findById(productId);

    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

    return product.toObject();
  }

  @Get('/')
  @ApiOkResponse({ description: 'Returns products page by given filters' })
  @UsePipes(
    new ParseIntValuesPipe(['limit', 'skip']),
    new ParseBoolValuesPipe(['inStock']),
    new DefaultValuesPipe({
      limit: 50,
      orderBy: 'createdTime',
      order: 'desc',
      inStock: true,
      skip: 0,
    }),
    new ValidationPipe(),
  )
  async getProducts(@Query() filters: GetProductsDto) {
    const products = await this.productsService.find(filters);
    const data = products.map(product => product.toObject());
    const count = await this.productsService.count(filters);
    return { count, data };
  }
}
