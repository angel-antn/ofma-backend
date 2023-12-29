import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddMusicianInContentDto {
  @IsString()
  @IsUUID()
  exclusiveContentId: string;

  @IsString()
  @IsUUID()
  musicianId: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}
