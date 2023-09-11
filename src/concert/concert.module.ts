import { Module } from '@nestjs/common';
import { ConcertService } from './concert.service';
import { ConcertController } from './concert.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from './entities/concert.entity';

@Module({
  controllers: [ConcertController],
  providers: [ConcertService],
  imports: [TypeOrmModule.forFeature([Concert])],
  exports: [TypeOrmModule],
})
export class ConcertModule {}
