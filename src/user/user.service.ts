import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { CreateUserDto, LoginUserDto } from './dto/';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      delete user.isActive;
      delete user.password;
      return { user, token: this.generateJwt({ id: user.id, role: 'user' }) };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email: email.toLocaleLowerCase(), isActive: true },
      select: {
        email: true,
        password: true,
        name: true,
        lastname: true,
        id: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('not valid email');
    } else if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('not valid password');
    }
    delete user.password;
    return { user, token: this.generateJwt({ id: user.id, role: 'user' }) };
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
