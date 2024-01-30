import { IsOptional, IsBooleanString } from 'class-validator';

export class GetBankAccountQueriesDto {
  @IsOptional()
  @IsBooleanString()
  all: 'true' | 'false' = 'true';
}
