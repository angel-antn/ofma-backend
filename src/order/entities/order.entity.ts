import { MobilePayBankAccount } from 'src/bank-account/entities/mobile-pay-bank-account.entity';
import { TransferBankAccount } from 'src/bank-account/entities/transfer-bank-account.entity';
import { ZelleBankAccount } from 'src/bank-account/entities/zelle-bank-account.entity';
import { ExchangeRate } from 'src/exchange-rate/entities/exchange-rate.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float')
  amount: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('date')
  paidAt: Date;

  @Column('text')
  type: string;

  @Column('text')
  status: string;

  @Column('text')
  reference: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToOne(() => ExchangeRate, (exchangeRate) => exchangeRate.orders, {
    nullable: true,
  })
  exchangeRate?: ExchangeRate;

  @ManyToOne(() => MobilePayBankAccount, (bankAccount) => bankAccount.orders, {
    nullable: true,
  })
  mobilePayBankAccount?: MobilePayBankAccount;

  @ManyToOne(() => TransferBankAccount, (bankAccount) => bankAccount.orders, {
    nullable: true,
  })
  transferBankAccount?: TransferBankAccount;

  @ManyToOne(() => ZelleBankAccount, (bankAccount) => bankAccount.orders, {
    nullable: true,
  })
  zelleBankAccount?: ZelleBankAccount;
}
