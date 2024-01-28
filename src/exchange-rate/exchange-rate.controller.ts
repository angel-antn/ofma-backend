import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import { ApiTags } from '@nestjs/swagger';
import { ValidRoles } from 'src/common/enums/valid-roles.enum';
import { Auth } from 'src/common/decorators/auth.decorator';

@ApiTags('Exchange-rate')
@Controller('exchange-rate')
export class ExchangeRateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @Post()
  @Auth(ValidRoles.admin_user)
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
