import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddPromocodeDto {
  @IsString()
  @ApiModelProperty()
  readonly promocode: string;
}
