import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsOptional, Matches } from 'class-validator';

export class AddToCartDto {
  @IsString()
  @Matches(/^[a-f\d]{24}$/i)
  @ApiModelProperty()
  readonly productId: string;

  @IsNumber()
  @Min(1)
  @ApiModelProperty()
  readonly qty: number;

  @IsString()
  @IsOptional()
  @Matches(/^[a-f\d]{24}$/i)
  @ApiModelPropertyOptional()
  readonly cartId?: string;
}
