import { Document } from 'mongoose';

export interface User extends Document {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly country: string;
  readonly postalCode: string;
  readonly address: string;
  readonly isAdmin: boolean;
}
