import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
  HttpCode,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserAuthDto } from './dto/user-auth.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { PasswordChangeDto } from './dto/password-change.dto';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { User as UserInterface } from './interfaces/user.interface';
import {
  ApiUseTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../shared/decorators/user.decorator';

@ApiUseTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiCreatedResponse({ description: 'The user has been successfully created' })
  @UsePipes(new ValidationPipe())
  async register(@Body() userData: UserAuthDto) {
    // check if user already exists
    if (await this.usersService.findByEmail(userData.email)) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    // create a new user by email/password and generate JWT
    const user: UserInterface = await this.usersService.create(userData);
    const jwt: string = await this.authService.getJWT({
      email: userData.email,
    });

    return { ...user.toObject(), jwt };
  }

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Login succeeded' })
  @UsePipes(new ValidationPipe())
  async login(@Body() userData: UserAuthDto) {
    // get user by email
    const user: UserInterface = await this.usersService.findByEmail(
      userData.email,
    );

    if (!user)
      throw new HttpException(
        'User or password incorrect',
        HttpStatus.NOT_FOUND,
      );

    // check if password valid
    const match: boolean = await this.authService.comparePassword(
      userData.password,
      user.password,
    );

    if (!match)
      throw new HttpException(
        'User or password incorrect',
        HttpStatus.NOT_FOUND,
      );

    // generate JWT
    const jwt: string = await this.authService.getJWT({
      email: userData.email,
    });

    return { ...user.toObject(), jwt };
  }

  @Post(':userId/password')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Password changed' })
  @UseGuards(AuthGuard())
  @UsePipes(new ValidationPipe())
  async changePassword(
    @User() user: UserInterface,
    @Body() data: PasswordChangeDto,
    @Param('userId') userId: string,
  ) {
    // user can update only his own profile for now
    if (user._id.toString() !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    // check if password valid
    const match: boolean = await this.authService.comparePassword(
      data.passwordOld,
      user.password,
    );

    if (!match) {
      throw new HttpException(
        'Old password does not match',
        HttpStatus.FORBIDDEN,
      );
    }

    const password = await this.authService.hashPassword(data.passwordNew);
    user.set({ password });
    await user.save();

    return user.toObject();
  }

  @Get('getByToken')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns current user object' })
  @UseGuards(AuthGuard())
  async getByToken(@User() user: UserInterface) {
    return user.toObject();
  }

  @Patch(':userId')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns updated user object' })
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard())
  async updateUserData(
    @User() user: UserInterface,
    @Body() userData: PatchUserDto,
    @Param('userId') userId: string,
  ) {
    // user can update only his own profile for now
    if (user._id.toString() !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    user.set(userData);
    await user.save();

    return user.toObject();
  }
}
