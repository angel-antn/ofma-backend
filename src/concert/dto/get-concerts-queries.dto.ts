import { IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class ConcertsQueriesDto {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  all: boolean = true;
}
