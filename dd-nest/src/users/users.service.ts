import { Model } from 'mongoose';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { UserAuthDto } from './dto/user-auth.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async create(userAuthDto: UserAuthDto): Promise<User> {
    const password: string = await this.authService.hashPassword(
      userAuthDto.password,
    );

    const user = new this.userModel({
      password,
      email: userAuthDto.email,
    });

    return user.save();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }
}
