import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminUser } from '../entities/admin-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(AdminUser)
    private readonly userRepository: Repository<AdminUser>,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<AdminUser> {
    const { id } = payload;
    const user = await this.userRepository.findOneBy({ id, isActive: true });
    if (!user) {
      throw new UnauthorizedException('not valid token');
    }
    return user;
  }
}
