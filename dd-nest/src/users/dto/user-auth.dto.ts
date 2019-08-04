import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UserAuthDto {
  @IsEmail()
  @ApiModelProperty()
  readonly email: string;

  @IsNotEmpty()
  @ApiModelProperty()
  readonly password: string;
}
