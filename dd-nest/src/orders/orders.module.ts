import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { YandexService } from './yandex.service';
import { OrderSchema } from './schemas/order.schema';
import { CartsModule } from '../carts/carts.module';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    AuthModule,
    CartsModule,
    ProductsModule,
    MailModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, YandexService],
})
export class OrdersModule {}
