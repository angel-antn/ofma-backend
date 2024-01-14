import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from './entities/bank.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [BankController],
  providers: [BankService],
  imports: [TypeOrmModule.forFeature([Bank]), CommonModule],
  exports: [BankService],
})
export class BankModule {}
