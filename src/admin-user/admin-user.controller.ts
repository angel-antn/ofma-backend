import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { LoginAdminUserDto } from './dto';
import { AdminUser } from './entities/admin-user.entity';
import { AuthGuard } from '@nestjs/passport';
import { getAdminUser } from './decorators/get-admin-user.decorator';

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
  @UseGuards(AuthGuard())
  me(@getAdminUser() adminUser: AdminUser) {
    return { adminUser };
  }
}
