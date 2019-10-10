import {
  Controller,
  Param,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Inject,
  Delete,
  Patch,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ApiUseTags, ApiOkResponse } from '@nestjs/swagger';
import { DefaultValuesPipe } from '../shared/pipes/default-values.pipe';
import { ProductsService } from '../products/products.service';
import { BulkQtyUpdateDto } from './dto/bulk-qty-update.dto';
import { MongoIdParams } from 'shared/dto/mongo-id.dto';
import { RemoveFromCartParams } from './dto/remove-from-cart.dto';
import { PromocodesService } from 'promocodes/promocodes.service';
import { AddPromocodeDto } from './dto/add-promocode.dto';

@ApiUseTags('carts')
@Controller('carts')
export class CartsController {
  constructor(
    @Inject(ProductsService) private readonly productsService: ProductsService,
    @Inject(PromocodesService)
    private readonly promocodesService: PromocodesService,
    private readonly cartsService: CartsService,
  ) {}

  @Get(':id')
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ description: 'Returns cart object' })
  async getById(@Param() params: MongoIdParams) {
    const cart = await this.cartsService.findById(params.id);

    if (!cart) throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);

    await cart.populate('items.product').execPopulate();

    return cart.toObject();
  }

  @Post('/add')
  @UsePipes(
    new DefaultValuesPipe({
      qty: 1,
    }),
    new ValidationPipe(),
  )
  @ApiOkResponse({ description: 'Returns updated or created cart object' })
  async addToCart(@Body() data: AddToCartDto) {
    // validate that product exists
    const product = await this.productsService.findById(data.productId);
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

    // find or create a cart
    const cart = data.cartId
      ? await this.cartsService.findById(data.cartId)
      : await this.cartsService.create();

    // throw error if invalid cartId provided
    if (!cart) throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);

    // check if item already in the cart
    const item = cart.items.find(
      cartItem => cartItem.product.toString() === data.productId,
    );

    if (item) {
      item.qty += data.qty;
    } else {
      cart.items.push({ product: data.productId, qty: data.qty });
    }

    cart.updatedTime = new Date();

    await cart.calcDelivery();
    await cart.save();

    return cart.toObject();
  }

  @Delete('/:cartId/:productId')
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ description: 'Returns updated cart object' })
  async removeFromCart(@Param() params: RemoveFromCartParams) {
    const cart = await this.cartsService.findById(params.cartId);

    if (!cart) throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);

    cart.items = cart.items.filter(
      item => item.product.toString() !== params.productId,
    );

    cart.updatedTime = new Date();

    await cart.calcDelivery();
    await cart.save();

    return cart.toObject();
  }

  @Patch('/:id')
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ description: 'Returns updated cart object' })
  async bulkQtyUpdate(
    @Param() params: MongoIdParams,
    @Body() data: BulkQtyUpdateDto,
  ) {
    const cart = await this.cartsService.findById(params.id);

    if (!cart) throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);

    cart.items = cart.items.map(item => {
      const found = data.items.find(({ product }) => {
        return item.product.toString() === product;
      });

      if (found) item.qty = found.qty;

      return item;
    });

    cart.updatedTime = new Date();

    await cart.calcDelivery();
    await cart.save();

    return cart.toObject();
  }

  @Post('/:id/promocode')
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ description: 'Returns updated cart object' })
  async addPromocode(
    @Param() params: MongoIdParams,
    @Body() body: AddPromocodeDto,
  ) {
    const cart = await this.cartsService.findById(params.id);
    if (!cart) throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);

    const promocode = await this.promocodesService.findByCode(body.promocode);
    if (!promocode)
      throw new HttpException('Promocode does not exist', HttpStatus.NOT_FOUND);

    // check if promocode already exists in cart
    const [existingPromo] = cart.promocodes;
    if (
      existingPromo &&
      existingPromo.promocode.toString() === promocode._id.toString()
    )
      return cart.toObject();

    // validate promocode conditions
    await this.promocodesService.validate(promocode).catch(err => {
      throw new HttpException(
        { message: 'Promocode validation error', code: err.code },
        HttpStatus.BAD_REQUEST,
      );
    });

    // add promocode to cart
    cart.promocodes = [
      {
        promocode: promocode._id,
        code: promocode.code,
        discount: promocode.discount,
        minSum: promocode.limitations.minSum,
      },
    ];

    // calc delivery
    await cart.calcDelivery();
    await cart.save();

    return cart.toObject();
  }
}
