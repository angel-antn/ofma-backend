import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { HttpModule } from '@nestjs/axios';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [StripeController],
  providers: [StripeService],
  imports: [HttpModule, CommonModule],
})
export class StripeModule {}
