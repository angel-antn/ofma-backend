import { Controller, Post, Body } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { LoginAdminUserDto } from './dto';

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
}
