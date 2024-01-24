import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Exchange-rate')
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
