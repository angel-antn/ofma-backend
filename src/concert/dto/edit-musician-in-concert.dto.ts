import { IsNotEmpty, IsString } from 'class-validator';

export class EditMusicianInConcertDto {
  @IsString()
  @IsNotEmpty()
  role: string;
}
