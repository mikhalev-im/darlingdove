import { IsString, Matches } from 'class-validator';

export class RemoveFromCartParams {
  @IsString()
  @Matches(/^[a-f0-9]{24}$/)
  cartId: string;

  @IsString()
  @Matches(/^[a-f0-9]{24}$/)
  productId: string;
}
