import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class ChangeShownStatusDto {
  @IsString()
  @IsUUID()
  id: string;

  @IsBoolean()
  isShown: boolean;
}
