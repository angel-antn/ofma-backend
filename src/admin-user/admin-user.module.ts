import { Module } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { AdminUserController } from './admin-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from './entities/admin-user.entity';

@Module({
  controllers: [AdminUserController],
  providers: [AdminUserService],
  imports: [TypeOrmModule.forFeature([AdminUser])],
  exports: [TypeOrmModule],
})
export class AdminUserModule {}
