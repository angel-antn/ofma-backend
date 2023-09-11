import { Module } from '@nestjs/common';
import { MusicianService } from './musician.service';
import { MusicianController } from './musician.controller';
import { Musician } from './entities/musician.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [MusicianController],
  providers: [MusicianService],
  imports: [TypeOrmModule.forFeature([Musician])],
  exports: [TypeOrmModule],
})
export class MusicianModule {}
