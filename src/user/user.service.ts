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

import {
  CreateUserDto,
  LoginUserDto,
  ResetPasswordRequestDto,
  UpdateUserDto,
  ValidateResetPasswordRequestDto,
} from './dto/';
import { User } from './entities/user.entity';

import { createTransport } from 'nodemailer';

import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { UserWillCollaborateDto } from './dto/user-will-collaborate.dto';

import { readFileSync } from 'fs';
import { join } from 'path';

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

  async changeIsCollaboratorStatus(
    userWillCollaborateDto: UserWillCollaborateDto,
  ) {
    const { email, isCollaborator } = userWillCollaborateDto;

    const registeredUser = await this.findUserByEmail(email);

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

  async sendResetPasswordRequest(
    resetPasswordRequestDto: ResetPasswordRequestDto,
  ) {
    const { email } = resetPasswordRequestDto;
    const otp = this.generateOtp();

    const registeredUser = await this.findUserByEmail(email);

    try {
      const user = await this.userRepository.preload({
        id: registeredUser.id,
        resetPasswordOtp: otp,
      });
      await this.userRepository.save(user);
    } catch (err) {
      this.handleExceptions(err);
    }

    const path = join(__dirname, '../../static/', 'recover-password.html');

    let html = readFileSync(path, 'utf8');

    for (let i = 0; i < otp.length; i++) {
      html = html.replace(`[${i + 1}]`, otp[i]);
    }

    await this.sendHtmlEmail(email, html, 'Restablecer contraseña');

    return {
      sendedTo: email,
    };
  }

  async validateResetPasswordRequest(
    validateResetPasswordRequestDto: ValidateResetPasswordRequestDto,
  ) {
    const { email, resetPasswordOtp, password } =
      validateResetPasswordRequestDto;

    const registeredUser = await this.findUserByEmail(email, true);

    if (registeredUser.resetPasswordOtp !== resetPasswordOtp) {
      throw new BadRequestException('Non valid reset password otp');
    }

    try {
      const user = await this.userRepository.preload({
        id: registeredUser.id,
        resetPasswordOtp: null,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      delete user.resetPasswordOtp;
      delete user.password;
      return user;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  private async findUserByEmail(email: string, selectOtp = false) {
    let registeredUser: User;

    try {
      registeredUser = await this.userRepository.findOne({
        where: { email },
        select: { resetPasswordOtp: selectOtp, id: true },
      });
    } catch (err) {
      this.handleExceptions(err);
    }

    if (!registeredUser) {
      throw new BadRequestException('User is not registered');
    }

    return registeredUser;
  }

  private generateJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private generateOtp(): string {
    let otp = '';
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  }

  private async sendHtmlEmail(email: string, html: string, subject: string) {
    const transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_KEY,
      },
    });

    try {
      await transporter.sendMail({
        from: `"ofma app" <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        html,
      });
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  private handleExceptions(err): never {
    if (err.code == '23505') {
      throw new BadRequestException(err.detail);
    }
    console.log(err);
    throw new InternalServerErrorException('server failed, check the logs!');
  }
}
