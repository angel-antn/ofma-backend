import { MobilePayBankAccount } from 'src/bank-account/entities/mobile-pay-bank-account.entity';
import { TransferBankAccount } from 'src/bank-account/entities/transfer-bank-account.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Banks')
export class Bank {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @Column('text', { unique: true })
  code: string;

  @Column('bool', { default: true, select: false })
  isActive: boolean;

  //relations
  @OneToMany(
    () => TransferBankAccount,
    (transferBankAccount) => transferBankAccount.bank,
    { cascade: true },
  )
  transferBankAccount?: TransferBankAccount[];

  @OneToMany(
    () => MobilePayBankAccount,
    (mobilePayBankAccount) => mobilePayBankAccount.bank,
    { cascade: true },
  )
  mobilePayBankAccount?: MobilePayBankAccount[];
}
