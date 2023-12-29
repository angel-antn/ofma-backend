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

import {
  CreateAdminUserDto,
  LoginAdminUserDto,
  ResetPasswordRequestDto,
  ValidateResetPasswordRequestDto,
} from './dto';
import { AdminUser } from './entities/admin-user.entity';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

import { createTransport } from 'nodemailer';

import { readFileSync } from 'fs';
import { join } from 'path';

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

  async sendResetPasswordRequest(
    resetPasswordRequestDto: ResetPasswordRequestDto,
  ) {
    const { email } = resetPasswordRequestDto;
    const otp = this.generateOtp();

    const registeredUser = await this.findUserByEmail(email);

    try {
      const user = await this.adminUserRepository.preload({
        id: registeredUser.id,
        resetPasswordOtp: otp,
      });
      await this.adminUserRepository.save(user);
    } catch (err) {
      this.handleExceptions(err);
    }

    const path = join(
      __dirname,
      '../../static/',
      'recover-admin-password.html',
    );

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
      const user = await this.adminUserRepository.preload({
        id: registeredUser.id,
        resetPasswordOtp: null,
        password: bcrypt.hashSync(password, 10),
      });
      await this.adminUserRepository.save(user);
      delete user.resetPasswordOtp;
      delete user.password;
      return user;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  private async findUserByEmail(email: string, selectOtp = false) {
    let registeredUser: AdminUser;

    try {
      registeredUser = await this.adminUserRepository.findOne({
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
