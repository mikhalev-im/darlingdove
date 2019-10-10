import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Promocode } from './interfaces/promocode.interface';
import { OrdersService } from 'orders/orders.service';
import { CustomError } from 'shared/errors';

@Injectable()
export class PromocodesService {
  constructor(
    @InjectModel('Promocode') private readonly promocodeModel: Model<Promocode>,
    @Inject(OrdersService) private readonly ordersService: OrdersService,
  ) {}

  async findByCode(code: string): Promise<Promocode> {
    return this.promocodeModel.findOne({ code });
  }

  async validate(promocode: Promocode, userId?: string): Promise<void> {
    const now = new Date();
    if (promocode.startTime && now < promocode.startTime) {
      throw new CustomError(
        'Promocode start time is not yet come',
        'PROMOCODE_START_TIME_NOT_COME',
      );
    }

    if (promocode.endTime && now > promocode.endTime) {
      throw new CustomError('Promocode is expired', 'PROMOCODE_EXPIRED');
    }

    if (!promocode.limitations) return;

    if (promocode.limitations.totalUsage) {
      const count = await this.ordersService.countTotalPromocodeUsage(
        promocode._id,
      );
      if (promocode.limitations.totalUsage >= count)
        throw new CustomError(
          'Promocode total usage is exceeded',
          'PROMOCODE_TOTAL_USAGE_LIMIT',
        );
    }

    if (promocode.limitations.usagePerUser && userId) {
      const count = await this.ordersService.countPromocodeUsageByUser(
        promocode._id,
        userId,
      );
      if (promocode.limitations.usagePerUser >= count)
        throw new CustomError(
          'Promocode usage per user is exceeded',
          'PROMOCODE_USAGE_PER_USER_LIMIT',
        );
    }
  }
}
