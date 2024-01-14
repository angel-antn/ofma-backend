import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';

@Controller('exchange-rate')
export class ExchangeRateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @Post()
  create(@Body() createExchangeRateDto: CreateExchangeRateDto) {
    return this.exchangeRateService.create(createExchangeRateDto);
  }

  @Get()
  getLatest() {
    return this.exchangeRateService.getLatest();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.exchangeRateService.get(id);
  }
}
