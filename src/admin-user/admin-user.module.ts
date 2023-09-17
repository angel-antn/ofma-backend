import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AdminUserService } from './admin-user.service';
import { AdminUserController } from './admin-user.controller';
import { AdminUser } from './entities/admin-user.entity';
import { AdminJwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AdminUserController],
  providers: [AdminUserService, AdminJwtStrategy],
  imports: [
    TypeOrmModule.forFeature([AdminUser]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        if (!process.env.JWT_SECRET)
          throw new Error('JWT secret misconfigured');
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
  ],
  exports: [TypeOrmModule, AdminJwtStrategy, PassportModule, JwtModule],
})
export class AdminUserModule {}
