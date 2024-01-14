import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateExchangeRateDto } from './dto/create-exchange-rate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExchangeRateService {
  constructor(
    @InjectRepository(ExchangeRate)
    private readonly exchangeRateRepository: Repository<ExchangeRate>,
  ) {}

  async create(createExchangeRateDto: CreateExchangeRateDto) {
    try {
      const exchangeRate: ExchangeRate = this.exchangeRateRepository.create(
        createExchangeRateDto,
      );
      await this.exchangeRateRepository.save(exchangeRate);
      return exchangeRate;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async getLatest() {
    return await this.exchangeRateRepository
      .createQueryBuilder('exchangeRate')
      .orderBy('exchangeRate.createdAt', 'DESC')
      .getOne();
  }

  async get(id: string) {
    const result = await this.exchangeRateRepository.findOneBy({
      id,
    });
    if (!result) throw new NotFoundException('Exchange rate was not found');
    return result;
  }

  private handleExceptions(err): never {
    if (err.code == '23505') {
      throw new BadRequestException(err.detail);
    }
    console.log(err);
    throw new InternalServerErrorException('server failed, check the logs!');
  }
}
