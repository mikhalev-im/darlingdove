import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { CartSchema } from './schemas/cart.schema';
import { ProductsModule } from '../products/products.module';
import { AuthModule } from '../auth/auth.module';
import { PromocodesModule } from 'promocodes/promocodes.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
    AuthModule,
    ProductsModule,
    forwardRef(() => PromocodesModule),
  ],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
