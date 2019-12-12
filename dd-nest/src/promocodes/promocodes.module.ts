import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromocodeSchema } from './schemas/promocode.schema';
import { PromocodesService } from './promocodes.service';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Promocode', schema: PromocodeSchema }]),
    forwardRef(() => OrdersModule),
  ],
  controllers: [],
  providers: [PromocodesService],
  exports: [PromocodesService],
})
export class PromocodesModule {}
