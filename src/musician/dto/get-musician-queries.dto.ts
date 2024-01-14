import { IsOptional, IsBooleanString, IsString } from 'class-validator';

export class MusicianQueriesDto {
  @IsOptional()
  @IsBooleanString()
  highlighted: 'true' | 'false' = 'false';

  @IsOptional()
  @IsString()
  name: string = undefined;
}
