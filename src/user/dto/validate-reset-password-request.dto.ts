import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class ValidateResetPasswordRequestDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @Length(6)
  resetPasswordOtp: string;
}
