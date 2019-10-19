import qs from 'querystring';
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
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ProductsService } from '../products/products.service';
import { YandexService } from './yandex.service';
import {
  ApiUseTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { CartsService } from '../carts/carts.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../shared/decorators/user.decorator';
import { User as UserInterface } from '../users/interfaces/user.interface';
import { CreateFromCartDto } from './dto/create-from-cart.dto';
import { OrderStatusTypes } from './interfaces/order.interface';
import {
  PaymentProcess,
  PaymentProcessStatus,
} from './interfaces/yandex.interface';
import { MailService } from '../mail/mail.service';
import { MongoIdParams } from 'shared/dto/mongo-id.dto';
import { Product } from 'products/interfaces/product.interface';
import { Promocode } from 'promocodes/interfaces/promocode.interface';
import { PromocodesService } from 'promocodes/promocodes.service';

// Helper function to build payment success/failure redirect urls
const getRedirectUrl = (
  orderId: string,
  requestId: string,
  paymentStatus: string,
): string => {
  return `https://darlingdove.ru/orders/${orderId}?${qs.stringify({
    requestId,
    paymentStatus,
  })}`;
};

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
    private readonly yandexService: YandexService,
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

    if (!order || order.user._id.toString() !== user._id.toString())
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);

    await order.populate('items.product').execPopulate();

    return order.toObject();
  }

  @Get('/')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Retruns user orders' })
  @UseGuards(AuthGuard())
  async getByUserId(@User() user: UserInterface) {
    const orders = await this.ordersService.findByUserAndPopulate(user._id);
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
    const promocodes = cart.promocodes.map(async promo => {
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
    });

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

  @Post('/:id/pay')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({ description: 'Process order payment' })
  @UseGuards(AuthGuard())
  async pay(
    @Param() params: MongoIdParams,
    @User() user: UserInterface,
    @Res() res,
  ) {
    // find order by id and check user id
    const order = await this.ordersService.findById(params.id);
    if (!order || order.user._id !== user._id) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    // check if order already paid
    if (order.status !== OrderStatusTypes.NotPaid) {
      throw new HttpException('Order is already paid', HttpStatus.BAD_REQUEST);
    }

    let url: string;
    try {
      const amount = order.items.reduce((sum, item) => item.price + sum, 0);
      const paymentData = await this.yandexService.requestPayment(amount);

      // build callback urls
      const requestId = paymentData.request_id;
      const successUrl = getRedirectUrl(order._id, requestId, 'success');
      const failureUrl = getRedirectUrl(order._id, requestId, 'failure');

      const processData = await this.yandexService.processPayment(
        requestId,
        successUrl,
        failureUrl,
      );

      // TODO:
      // status should be `ext_auth_required` (add a check)

      // save request_id to check payment later
      // also need to store some debug data like
      // - current date and time
      // - full response?
      order.paymentRequests.push({
        requestId,
        status: processData.status,
        createdTime: new Date(),
      });
      await order.save();

      url = `${processData.acs_uri}?${qs.stringify(processData.acs_params)}`;
    } catch (err) {
      // log error for debugging
      console.error(err);
      // return internal server error
      throw new HttpException(
        'Error occured while processing order payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    res.redirect(url);
  }

  // TODO
  @Get('/:orderId/payment/:requestId')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Checks order payment by request id' })
  @UseGuards(AuthGuard())
  async checkPaymentStatus(
    @Param('orderId') orderId: string,
    @Param('requestId') requestId: string,
    @User() user: UserInterface,
  ) {
    // find order by id and check user id
    const order = await this.ordersService.findById(orderId);
    if (!order || order.user._id !== user._id) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    // check if order contains payment request id
    const paymentRequest = order.paymentRequests.find(
      pr => pr.requestId === requestId,
    );
    if (!paymentRequest)
      throw new HttpException(
        'Payment request does not exist on this order',
        HttpStatus.BAD_REQUEST,
      );

    const successUrl = getRedirectUrl(order._id, requestId, 'success');
    const failureUrl = getRedirectUrl(order._id, requestId, 'failure');

    let data: PaymentProcess;
    do {
      data = await this.yandexService.processPayment(
        requestId,
        successUrl,
        failureUrl,
      );
      if (data.status === 'in_progress') {
        await new Promise(resolve => setTimeout(resolve, data.next_retry));
      }
    } while (data.status === 'in_progress');

    // process `success` / `refused` / `ext_auth_required`

    // update paymentRequest
    paymentRequest.status = data.status;
    paymentRequest.updatedTime = new Date();
    order.updatedTime = new Date();

    if (data.status === PaymentProcessStatus.Success) {
      order.status = OrderStatusTypes.Paid;
    }

    await order.save();
    return order.toObject();
  }
}
