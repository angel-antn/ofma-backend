import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class CreateMusicianDto {
  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsString()
  description: string;

  @Type(() => Date)
  @IsDate()
  dates: Date;
}
