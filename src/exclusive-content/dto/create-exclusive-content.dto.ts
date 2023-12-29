import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateExclusiveContentDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isHighlighted?: boolean;

  @IsString()
  @IsIn(['concierto', 'entrevista'])
  category: string;
}
