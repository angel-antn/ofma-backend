import { Module } from '@nestjs/common';
import { MusicianService } from './musician.service';
import { MusicianController } from './musician.controller';

@Module({
  controllers: [MusicianController],
  providers: [MusicianService],
})
export class MusicianModule {}
