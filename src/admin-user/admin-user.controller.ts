import { Controller, Post, Body, Get } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { LoginAdminUserDto } from './dto';
import { AdminUser } from './entities/admin-user.entity';
import { getUser } from 'src/common/decorators/get-user.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { ValidRoles } from 'src/common/enums/valid-roles.enum';

@Controller('admin-user')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Post('register')
  register(@Body() createAdminUserDto: CreateAdminUserDto) {
    return this.adminUserService.register(createAdminUserDto);
  }

  @Post('login')
  login(@Body() createAdminUserDto: LoginAdminUserDto) {
    return this.adminUserService.login(createAdminUserDto);
  }

  @Get('me')
  @Auth(ValidRoles.admin_user)
  me(@getUser() adminUser: AdminUser) {
    return { adminUser };
  }
}
