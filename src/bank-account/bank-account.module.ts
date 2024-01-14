import { Module } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { BankAccountController } from './bank-account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransferBankAccount } from './entities/transfer-bank-account.entity';
import { MobilePayBankAccount } from './entities/mobile-pay-bank-account.entity';
import { ZelleBankAccount } from './entities/zelle-bank-account.entity';
import { CommonModule } from 'src/common/common.module';
import { BankModule } from 'src/bank/bank.module';

@Module({
  controllers: [BankAccountController],
  providers: [BankAccountService],
  imports: [
    TypeOrmModule.forFeature([
      TransferBankAccount,
      MobilePayBankAccount,
      ZelleBankAccount,
    ]),
    BankModule,
    CommonModule,
  ],
})
export class BankAccountModule {}
