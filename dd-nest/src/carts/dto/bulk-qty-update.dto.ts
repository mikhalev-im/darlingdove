import { ApiModelProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  Min,
  Matches,
  IsArray,
  ValidateNested,
} from 'class-validator';

class CartItem {
  @IsString()
  @Matches(/^[a-f\d]{24}$/i)
  @ApiModelProperty()
  readonly product: string;

  @IsNumber()
  @Min(1)
  @ApiModelProperty()
  readonly qty: number;
}

export class BulkQtyUpdateDto {
  @IsArray()
  @ValidateNested()
  @ApiModelProperty()
  readonly items: CartItem[];
}
