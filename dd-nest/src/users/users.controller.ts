import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  Query,
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
import { MailService } from '../mail/mail.service';
import { MongoIdParams } from '../shared/dto/mongo-id.dto';
import { GetUsersDto } from './dto/get-users.dto';

@ApiUseTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(MailService) private readonly mailService: MailService,
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

    // send email to user
    await this.mailService.sendRegisterMail(user);

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

  @Post(':id/password')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Password changed' })
  @UseGuards(AuthGuard())
  @UsePipes(new ValidationPipe())
  async changePassword(
    @User() user: UserInterface,
    @Body() data: PasswordChangeDto,
    @Param() params: MongoIdParams,
  ) {
    // user can update only his own profile for now
    if (user._id.toString() !== params.id) {
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

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns updated user object' })
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard())
  async updateUserData(
    @User() user: UserInterface,
    @Body() userData: PatchUserDto,
    @Param() params: MongoIdParams,
  ) {
    // user can update only his own profile for now
    if (user._id.toString() !== params.id) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    user.set(userData);
    await user.save();

    return user.toObject();
  }

  @Get('/')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns users' })
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard())
  async getUsers(@User() user: UserInterface, @Query() filters: GetUsersDto) {
    if (!user.isAdmin) {
      return {
        data: [user.toObject()],
        count: 1,
      };
    }

    const users = await this.usersService.find(filters);

    return {
      data: users.map(u => u.toObject()),
      count: users.length,
    };
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns user by id' })
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard())
  async getUser(@User() user: UserInterface, @Param() params: MongoIdParams) {
    if (user._id.toString() === params.id) {
      return user.toObject();
    }

    if (!user.isAdmin) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    const u = await this.usersService.findById(params.id);
    return u.toObject();
  }
}
