import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsMilitaryTime,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateConcertDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsMilitaryTime()
  startAtHour: string;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsString()
  address: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  entriesQty: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  pricePerEntry: number;
}
