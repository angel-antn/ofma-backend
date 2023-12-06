import { PartialType } from '@nestjs/mapped-types';
import { CreateConcertDto } from './create-concert.dto';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateConcertDto extends PartialType(CreateConcertDto) {
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isOpen?: boolean;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  hasFinish?: boolean;
}
