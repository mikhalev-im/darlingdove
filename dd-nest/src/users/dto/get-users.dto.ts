import {
  IsString,
  IsOptional,
  IsEnum,
  Min,
  IsNumber,
  Max,
} from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class GetUsersDto {
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
  @IsEnum(['createdAt'])
  @ApiModelPropertyOptional()
  readonly orderBy?: string;

  @IsString()
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @ApiModelPropertyOptional()
  readonly order?: string;
}
