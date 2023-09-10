import { Module } from '@nestjs/common';
import { ExclusiveContentService } from './exclusive-content.service';
import { ExclusiveContentController } from './exclusive-content.controller';

@Module({
  controllers: [ExclusiveContentController],
  providers: [ExclusiveContentService],
})
export class ExclusiveContentModule {}
