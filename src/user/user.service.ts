import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto/';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { UserWillCollaborate } from './dto/user-will-collaborate.dto';

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
      user.name = `${user.name[0].toUpperCase()}${user.name.slice(1)}`;
      user.lastname = `${user.lastname[0].toUpperCase()}${user.lastname.slice(
        1,
      )}`;
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
        isCollaborator: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('not valid email');
    } else if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('not valid password');
    }
    delete user.password;
    user.name = `${user.name[0].toUpperCase()}${user.name.slice(1)}`;
    user.lastname = `${user.lastname[0].toUpperCase()}${user.lastname.slice(
      1,
    )}`;
    return { user, token: this.generateJwt({ id: user.id, role: 'user' }) };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) throw new NotFoundException('User was not found');

    return await this.userRepository.save(user);
  }

  async changeIsCollaboratorStatus(userWillCheckOutDto: UserWillCollaborate) {
    const { email, isCollaborator } = userWillCheckOutDto;
    let registeredUser: User;
    try {
      registeredUser = await this.userRepository.findOne({
        where: { email },
      });
    } catch (err) {
      this.handleExceptions(err);
    }

    if (!registeredUser) {
      throw new BadRequestException('User is not registered');
    }
    try {
      const user = await this.userRepository.preload({
        id: registeredUser.id,
        isCollaborator,
      });
      await this.userRepository.save(user);
      return { user };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async getAllColaborators() {
    const result = await this.userRepository.find({
      where: { isActive: true, isCollaborator: true },
    });
    return { totalCount: result.length, result };
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
