import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { OrderStatusTypes } from '../interfaces/order.interface';

export class PatchOrderDto {
  @IsOptional()
  @IsString()
  @ApiModelPropertyOptional()
  readonly trackingNumber?: string;

  @IsOptional()
  @IsString()
  @IsEnum(OrderStatusTypes)
  @ApiModelPropertyOptional()
  readonly status?: OrderStatusTypes;
}
