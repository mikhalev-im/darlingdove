import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  Min,
  IsNumber,
  Max,
  IsBoolean,
} from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class GetProductsDto {
  @IsOptional()
  @IsString()
  @ApiModelPropertyOptional()
  readonly category?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(500)
  @ApiModelPropertyOptional()
  readonly limit?: number;

  @IsOptional()
  @IsNumber()
  @ApiModelPropertyOptional()
  readonly skip?: number;

  @IsString()
  @IsOptional()
  @IsEnum(['createdTime', 'ordersCount', 'name'])
  @ApiModelPropertyOptional()
  readonly orderBy?: string;

  @IsString()
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @ApiModelPropertyOptional()
  readonly order?: string;

  @IsOptional()
  @ApiModelPropertyOptional()
  readonly tagsOptional?: string | string[];

  @IsOptional()
  @ApiModelPropertyOptional()
  readonly tagsRequired?: string | string[];

  @IsBoolean()
  @IsOptional()
  @ApiModelPropertyOptional()
  readonly inStock?: boolean;

  @IsString()
  @IsOptional()
  readonly sku?: string;
}
