import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMusicianDto {
  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsString()
  description: string;

  @IsString()
  @IsEmail()
  email: string;

  @Type(() => Date)
  @IsDate()
  birthdate: Date;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isHighlighted?: boolean;

  @IsString()
  @IsIn(['mujer', 'hombre', 'otro'])
  gender: string;
}
