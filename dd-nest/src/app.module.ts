import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/carts.module';
import { PagesModule } from './pages/pages.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from 'orders/orders.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_CONNECTION),
    MailModule,
    UsersModule,
    ProductsModule,
    CartsModule,
    PagesModule,
    OrdersModule,
  ],
})
export class AppModule {}
