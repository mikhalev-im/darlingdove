import { IsString, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class PatchUserDto {
  @IsString()
  @IsOptional()
  @ApiModelProperty()
  readonly firstName: string;

  @IsString()
  @IsOptional()
  @ApiModelProperty()
  readonly lastName: string;

  @IsString()
  @IsOptional()
  @ApiModelProperty()
  readonly country: string;

  @IsString()
  @IsOptional()
  @ApiModelProperty()
  readonly postalCode: string;

  @IsString()
  @IsOptional()
  @ApiModelProperty()
  readonly address: string;
}
