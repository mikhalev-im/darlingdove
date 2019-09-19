import { IsString, Matches } from 'class-validator';

export class MongoIdParams {
  @IsString()
  @Matches(/^[a-f0-9]{24}$/)
  id: string;
}
