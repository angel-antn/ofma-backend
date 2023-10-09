import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminUserService } from './admin-user.service';
import { AdminUserController } from './admin-user.controller';
import { AdminUser } from './entities/admin-user.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [AdminUserController],
  providers: [AdminUserService],
  imports: [TypeOrmModule.forFeature([AdminUser]), CommonModule],
  exports: [TypeOrmModule],
})
export class AdminUserModule {}
