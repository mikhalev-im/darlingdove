import * as crypto from 'crypto';
import {
  Controller,
  Param,
  Get,
  Inject,
  HttpException,
  HttpStatus,
  UseGuards,
  Post,
  Body,
  Res,
  UsePipes,
  ValidationPipe,
  Logger,
  Query,
  Patch,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { ProductsService } from '../products/products.service';
import {
  ApiUseTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { CartsService } from '../carts/carts.service';
import { User } from '../shared/decorators/user.decorator';
import { User as UserInterface } from '../users/interfaces/user.interface';
import { CreateFromCartDto } from './dto/create-from-cart.dto';
import { OrderStatusTypes } from './interfaces/order.interface';
import { MailService } from '../mail/mail.service';
import { MongoIdParams } from '../shared/dto/mongo-id.dto';
import { Product } from '../products/interfaces/product.interface';
import { Promocode } from '../promocodes/interfaces/promocode.interface';
import { PromocodesService } from '../promocodes/promocodes.service';
import { YANDEX_PAYMENT_NOTIFICATION_SECRET } from './constants';
import { GetOrdersDto } from './dto/get-orders.dto';
import { PatchOrderDto } from './dto/patch-order.dto';

@ApiUseTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(CartsService) private readonly cartsService: CartsService,
    @Inject(ProductsService) private readonly productsService: ProductsService,
    @Inject(MailService) private readonly mailService: MailService,
    @Inject(PromocodesService)
    private readonly promocodesService: PromocodesService,
    private readonly ordersService: OrdersService,
  ) {}

  @Get(':id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ description: 'Returns order object' })
  @UseGuards(AuthGuard())
  async getById(@Param() params: MongoIdParams, @User() user: UserInterface) {
    // check if it is valid mongo id
    if (!/^[a-f\d]{24}$/i.test(params.id))
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);

    const order = await this.ordersService.findById(params.id);

    if (!order)
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);

    if (order.user._id.toString() !== user._id.toString() && !user.isAdmin)
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);

    await order.populate('items.product').execPopulate();

    return order.toObject();
  }

  @Get('/')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Retruns user orders' })
  @UseGuards(AuthGuard())
  async getByUserId(
    @Query() filters: GetOrdersDto,
    @User() user: UserInterface,
  ) {
    // return all orders for admin
    if (!user.isAdmin) {
      filters.user = user._id;
    }

    const orders = await this.ordersService.find(filters);
    return orders.map(order => order.toObject());
  }

  @Post('/')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({ description: 'Retruns created order' })
  @UseGuards(AuthGuard())
  async createFromCart(
    @User() user: UserInterface,
    @Body() { cartId, comment }: CreateFromCartDto,
  ) {
    // try to find a cart
    const cart = await this.cartsService.findById(cartId);

    if (!cart) throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    if (!cart.items.length)
      throw new HttpException('Cart is empty', HttpStatus.BAD_REQUEST);

    // populate items
    await cart
      .populate('items.product')
      .populate('promocodes.promocode')
      .execPopulate();

    // validate promocodes
    const promocodes = await Promise.all(
      cart.promocodes.map(async promo => {
        const promocode = promo.promocode as Promocode;

        if (!promocode) {
          // remove promocode from cart
          cart.promocodes = [];
          await cart.calcDelivery();
          await cart.save();
          // throw an error
          throw new HttpException(
            'Promocode does not exist',
            HttpStatus.NOT_FOUND,
          );
        }

        await this.promocodesService
          .validate(promocode, user._id)
          .catch(async err => {
            // remove promocode from cart
            cart.promocodes = [];
            await cart.calcDelivery();
            await cart.save();
            // throw custom error
            throw new HttpException(
              { message: 'Promocode validation error', code: err.code },
              HttpStatus.BAD_REQUEST,
            );
          });

        return {
          promocode: promocode._id,
          code: promocode.code,
          discount: promo.discount,
          minSum: promo.minSum,
        };
      }),
    );

    // subtract product qty
    // and validate that all products are enough in stock
    const items = cart.items.map(item => {
      const product = item.product as Product;

      if (!product)
        throw new HttpException(
          'Some of the products not exist',
          HttpStatus.NOT_FOUND,
        );

      const newQty = product.qty - item.qty;
      if (newQty < 0)
        throw new HttpException(
          {
            message: 'Not enough product qty in stock',
            code: 'PRODUCT_QTY_NOT_ENOUGH',
          },
          HttpStatus.BAD_REQUEST,
        );

      product.qty = newQty;
      product.ordersCount = (product.ordersCount || 0) + 1;

      return {
        product: product._id,
        qty: item.qty,
        price: product.price,
      };
    });

    // calc delivery
    const total = await cart.calcDelivery();

    // save all products if everything is valid;
    await Promise.all(
      cart.items.map(async item => {
        const product = item.product as Product;
        product.save();
      }),
    );

    // create order from cart
    const order = await this.ordersService.create({
      items,
      comment,
      promocodes,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        country: user.country,
        postalCode: user.postalCode,
        address: user.address,
      },
      total,
      services: cart.services,
      status: OrderStatusTypes.NotPaid,
    });

    // remove cart items
    cart.items = [];
    cart.services = [];
    cart.promocodes = [];
    cart.updatedTime = new Date();
    await cart.save();

    // populate order items
    await order.populate('items.product').execPopulate();

    // send email
    await this.mailService.sendNewOrderMail(user, order);

    return order.toObject();
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({ description: 'Updates order' })
  @UseGuards(AuthGuard())
  async updateOrder(
    @Param() params: MongoIdParams,
    @Body() data: PatchOrderDto,
    @User() user: UserInterface,
  ) {
    if (!user.isAdmin) {
      throw new ForbiddenException();
    }

    const order = await this.ordersService.findById(params.id);
    if (!order)
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);

    order.set(data);
    await order.save();

    // populate items
    await order
      .populate('items.product')
      .populate('promocodes.promocode')
      .execPopulate();

    return order.toObject();
  }

  @Post('/:id/pay')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({ description: 'Process order payment' })
  @UseGuards(AuthGuard())
  async pay(@Param() params: MongoIdParams, @User() user: UserInterface) {
    // find order by id and check user id
    const order = await this.ordersService.findById(params.id);
    if (!order || order.user._id.toString() !== user._id.toString()) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    // check if order already paid
    if (order.status !== OrderStatusTypes.NotPaid) {
      throw new HttpException('Order is already paid', HttpStatus.BAD_REQUEST);
    }

    // populate items
    await order
      .populate('items.product')
      .populate('promocodes.promocode')
      .execPopulate();

    // validate promocodes
    await Promise.all(
      order.promocodes.map(async promo => {
        const promocode = promo.promocode as Promocode;

        if (!promocode) {
          // throw an error
          throw new HttpException(
            'Promocode does not exist',
            HttpStatus.NOT_FOUND,
          );
        }

        await this.promocodesService
          .validate(promocode, user._id)
          .catch(async err => {
            // throw custom error
            throw new HttpException(
              { message: 'Promocode validation error', code: err.code },
              HttpStatus.BAD_REQUEST,
            );
          });
      }),
    );

    const url = await this.ordersService.createPayment(order._id, order.total);

    return { url };
  }

  @Post('/paymentNotification')
  async paymentNotification(@Body() body) {
    // nothing to do if there is no body
    if (!body) return;

    Logger.log(`Incoming payment notification: ${JSON.stringify(body)}`);

    // check hash
    if (!body.sha1_hash) return;

    const hashStr = `${body.notification_type}&${body.operation_id}&${body.amount}&${body.currency}&${body.datetime}&${body.sender}&${body.codepro}&${YANDEX_PAYMENT_NOTIFICATION_SECRET}&${body.label}`;
    const myHash = crypto.createHash('sha1');
    myHash.update(hashStr);

    const hashResult = myHash.digest('hex');

    Logger.log(`Payment notification hash result: ${hashResult}`);

    if (hashResult !== body.sha1_hash) {
      Logger.log('Payment notification hash does not match');
      return;
    }

    // payment not accepted
    if (body.unaccepted === 'true') return;
    // payment is protected with code
    if (body.codepro === 'true') return;
    // payment not from this store
    if (!body.label) return;

    const order = await this.ordersService.findById(body.label);
    // order does not exist
    if (!order) {
      Logger.log(`Payment notification order was not found: ${body.label}`);
      return;
    }
    // order already paid
    if (order.status === OrderStatusTypes.Paid) return;

    // update order status
    order.status = OrderStatusTypes.Paid;
    order.updatedTime = new Date();
    await order.save();
  }
}
