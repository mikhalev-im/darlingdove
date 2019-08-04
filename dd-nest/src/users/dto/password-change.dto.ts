import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class PasswordChangeDto {
  @IsString()
  @ApiModelProperty()
  readonly passwordOld: string;

  @IsString()
  @ApiModelProperty()
  readonly passwordNew: string;
}
