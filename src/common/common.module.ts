import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { AdminUser } from 'src/admin-user/entities/admin-user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [JwtStrategy],
  imports: [
    TypeOrmModule.forFeature([User, AdminUser]),
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
  exports: [JwtStrategy, PassportModule, JwtModule],
})
export class CommonModule {}
