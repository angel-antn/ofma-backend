import { Module } from '@nestjs/common';
import { ConcertService } from './concert.service';
import { ConcertController } from './concert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from './entities/concert.entity';
import { CommonModule } from 'src/common/common.module';
import { ConcertMusician } from './entities/concert-musician.entity';
import { MusicianModule } from 'src/musician/musician.module';

@Module({
  controllers: [ConcertController],
  providers: [ConcertService],
  imports: [
    TypeOrmModule.forFeature([Concert, ConcertMusician]),
    MusicianModule,
    CommonModule,
  ],
  exports: [TypeOrmModule],
})
export class ConcertModule {}
