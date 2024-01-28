import { Module } from '@nestjs/common';
import { ConcertService } from './concert.service';
import { ConcertController } from './concert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from './entities/concert.entity';
import { CommonModule } from 'src/common/common.module';
import { ConcertMusician } from './entities/concert-musician.entity';
import { MusicianModule } from 'src/musician/musician.module';
import { TicketModule } from 'src/ticket/ticket.module';

@Module({
  controllers: [ConcertController],
  providers: [ConcertService],
  imports: [
    TypeOrmModule.forFeature([Concert, ConcertMusician]),
    MusicianModule,
    TicketModule,
    CommonModule,
  ],
  exports: [TypeOrmModule, ConcertService],
})
export class ConcertModule {}
