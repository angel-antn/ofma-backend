import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginAdminUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  @MaxLength(50)
  password: string;
}
