import { Module } from '@nestjs/common';
import { ExclusiveContentService } from './exclusive-content.service';
import { ExclusiveContentController } from './exclusive-content.controller';
import { ExclusiveContent } from './entities/exclusive-content.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ExclusiveContentController],
  providers: [ExclusiveContentService],
  imports: [TypeOrmModule.forFeature([ExclusiveContent])],
  exports: [TypeOrmModule],
})
export class ExclusiveContentModule {}
