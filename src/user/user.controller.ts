import { Controller, Post, Body, Get } from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { getUser } from 'src/common/decorators/get-user.decorator';
import { ValidRoles } from 'src/common/enums/valid-roles.enum';
import { Auth } from 'src/common/decorators/auth.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get('me')
  @Auth(ValidRoles.user)
  me(@getUser() user: User) {
    return { user };
  }
}
