import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddMusicianInConcertDto {
  @IsString()
  @IsUUID()
  concertId: string;

  @IsString()
  @IsUUID()
  musicianId: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}
