import { Module } from '@nestjs/common';
import { MusicianService } from './musician.service';
import { MusicianController } from './musician.controller';
import { Musician } from './entities/musician.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [MusicianController],
  providers: [MusicianService],
  imports: [TypeOrmModule.forFeature([Musician]), CommonModule],
  exports: [TypeOrmModule, MusicianService],
})
export class MusicianModule {}
