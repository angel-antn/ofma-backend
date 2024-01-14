import { Module } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRateController } from './exchange-rate.controller';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { CommonModule } from 'src/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ExchangeRateController],
  providers: [ExchangeRateService],
  imports: [TypeOrmModule.forFeature([ExchangeRate]), CommonModule],
  exports: [ExchangeRateService],
})
export class ExchangeRateModule {}
