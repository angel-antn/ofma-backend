import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class UserWillCheckOutDto {
  @IsString()
  @IsUUID()
  id: string;

  @IsBoolean()
  canCheckOut: boolean;
}
