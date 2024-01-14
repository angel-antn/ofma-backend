import { IsOptional, IsBooleanString } from 'class-validator';

export class ConcertsQueriesDto {
  @IsOptional()
  @IsBooleanString()
  all: 'true' | 'false' = 'true';
}
