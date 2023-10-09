import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { CreateAdminUserDto, LoginAdminUserDto } from './dto';
import { AdminUser } from './entities/admin-user.entity';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminUserRepository: Repository<AdminUser>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createAdminUserDto: CreateAdminUserDto) {
    const { key, password, email } = createAdminUserDto;
    if (key !== process.env.ADMIN_KEY)
      throw new UnauthorizedException('key was not valid');
    try {
      const adminUser = this.adminUserRepository.create({
        email,
        password: bcrypt.hashSync(password, 10),
      });
      await this.adminUserRepository.save(adminUser);
      delete adminUser.isActive;
      delete adminUser.password;
      return {
        'admin-user': adminUser,
        token: this.generateJwt({ id: adminUser.id, role: 'admin_user' }),
      };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async login(loginUserDto: LoginAdminUserDto) {
    const { email, password } = loginUserDto;
    const adminUser = await this.adminUserRepository.findOne({
      where: { email: email.toLocaleLowerCase(), isActive: true },
      select: {
        email: true,
        password: true,
        id: true,
      },
    });

    if (!adminUser) {
      throw new UnauthorizedException('not valid email');
    } else if (!bcrypt.compareSync(password, adminUser.password)) {
      throw new UnauthorizedException('not valid password');
    }
    delete adminUser.password;
    return {
      'admin-user': adminUser,
      token: this.generateJwt({ id: adminUser.id, role: 'admin_user' }),
    };
  }

  private generateJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleExceptions(err): never {
    if (err.code == '23505') {
      throw new BadRequestException(err.detail);
    }
    console.log(err);
    throw new InternalServerErrorException('server failed, check the logs!');
  }
}
