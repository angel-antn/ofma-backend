import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';

import { UserService } from './user.service';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
  UserWillCollaborate,
} from './dto';
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

  @Patch(':id')
  @Auth(ValidRoles.user)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Post('user-will-collaborate')
  @Auth(ValidRoles.admin_user)
  changeIsCollaboratorStatus(@Body() userWillCollaborate: UserWillCollaborate) {
    return this.userService.changeIsCollaboratorStatus(userWillCollaborate);
  }

  @Get('collaborators')
  @Auth(ValidRoles.admin_user)
  getAllCollaborators() {
    return this.userService.getAllColaborators();
  }

  @Get('me')
  @Auth(ValidRoles.user)
  me(@getUser() user: User) {
    return { user };
  }
}
