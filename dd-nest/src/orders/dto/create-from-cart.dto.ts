import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class CreateFromCartDto {
  @IsString()
  @Matches(/^[a-f\d]{24}$/i)
  @ApiModelProperty()
  readonly cartId: string;

  @IsString()
  @ApiModelProperty()
  readonly comment: string;
}
