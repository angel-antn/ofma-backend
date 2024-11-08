import { Module } from '@nestjs/common';
import { ExclusiveContentService } from './exclusive-content.service';
import { ExclusiveContentController } from './exclusive-content.controller';
import { ExclusiveContent } from './entities/exclusive-content.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExclusiveContentMusician } from './entities/exclusive-content-musician.entity';
import { MusicianModule } from 'src/musician/musician.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [ExclusiveContentController],
  providers: [ExclusiveContentService],
  imports: [
    TypeOrmModule.forFeature([ExclusiveContent, ExclusiveContentMusician]),
    MusicianModule,
    CommonModule,
  ],
  exports: [TypeOrmModule],
})
export class ExclusiveContentModule {}
