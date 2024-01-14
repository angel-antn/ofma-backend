import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from './entities/bank.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>,
  ) {}

  async create(createBankDto: CreateBankDto) {
    try {
      const bank: Bank = this.bankRepository.create(createBankDto);
      await this.bankRepository.save(bank);
      return bank;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async findAll() {
    const result = await this.bankRepository.find({
      where: { isActive: true },
    });

    return { totalCount: result.length, result };
  }

  async findOne(id: string) {
    const result = await this.bankRepository.findOneBy({
      id,
      isActive: true,
    });
    if (!result) throw new NotFoundException('Bank was not found');
    return result;
  }

  async update(id: string, updateBankDto: UpdateBankDto) {
    const bank = await this.bankRepository.preload({
      id,
      ...updateBankDto,
    });

    if (!bank) throw new NotFoundException('bank was not found');

    try {
      const result = await this.bankRepository.save(bank);
      return result;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async remove(id: string) {
    const bank = await this.bankRepository.preload({
      id,
      isActive: false,
    });

    if (!bank) throw new NotFoundException('bank was not found');

    const result = await this.bankRepository.save(bank);
    delete result.isActive;
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
