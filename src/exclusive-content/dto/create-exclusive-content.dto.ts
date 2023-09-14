import { IsString } from 'class-validator';

export class CreateExclusiveContentDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
