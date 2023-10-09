import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminUser } from '../../admin-user/entities/admin-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminUserRepository: Repository<AdminUser>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<AdminUser | User> {
    const { id, role } = payload;
    let res: User | AdminUser;

    if (role === 'user') {
      res = await this.userRepository.findOneBy({ id, isActive: true });
      res.role = role;
    } else if (role === 'admin_user') {
      res = await this.adminUserRepository.findOneBy({ id, isActive: true });
      res.role = role;
    }

    if (!res) {
      throw new UnauthorizedException('not valid token');
    }

    return res;
  }
}
