import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsInt,
  IsLatLong,
  IsMilitaryTime,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateConcertDto {
  @IsString()
  name: string;

  @Type(() => Date)
  @IsDate({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  dates: Date[];

  @IsMilitaryTime({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  startAtHours: string[];

  @IsMilitaryTime({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  endAtHours: string[];

  @IsOptional()
  @IsLatLong()
  geo?: string;

  @IsString()
  description: string;

  @IsInt()
  @IsPositive()
  entriesQty: number;
}
