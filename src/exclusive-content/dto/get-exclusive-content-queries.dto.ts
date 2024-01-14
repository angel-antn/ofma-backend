import { IsOptional, IsBooleanString, IsIn, IsString } from 'class-validator';

export class ExclusiveContentQueriesDto {
  @IsOptional()
  @IsBooleanString()
  highlighted: 'true' | 'false' = 'false';

  @IsOptional()
  @IsBooleanString()
  published: 'true' | 'false' = 'false';

  @IsOptional()
  @IsBooleanString()
  shown: 'true' | 'false' = 'false';

  @IsOptional()
  @IsString()
  name: string = undefined;

  @IsOptional()
  @IsIn(['concierto', 'entrevista', undefined])
  category: 'concierto' | 'entrevista' | undefined = undefined;
}
