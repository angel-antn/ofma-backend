import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class UserWillCollaborate {
  @IsString()
  @IsEmail()
  email: string;

  @IsBoolean()
  isCollaborator: boolean;
}
