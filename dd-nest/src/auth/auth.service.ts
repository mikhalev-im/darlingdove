import { JwtService } from '@nestjs/jwt';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';

const CONFIG_BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, CONFIG_BCRYPT_SALT_ROUNDS);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async getJWT(payload: JwtPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.usersService.findByEmail(payload.email);
  }
}
