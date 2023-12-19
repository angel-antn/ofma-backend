import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class UserWillCollaborateDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsBoolean()
  isCollaborator: boolean;
}
