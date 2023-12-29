import { IsNotEmpty, IsString } from 'class-validator';

export class EditMusicianInContentDto {
  @IsString()
  @IsNotEmpty()
  role: string;
}
