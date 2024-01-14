import { Bank } from 'src/bank/entities/bank.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('MobilePayBankAccounts')
export class MobilePayBankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  accountHolderPhone: string;

  @Column('text')
  accountHolderDocument: string;

  @Column('text', { unique: true })
  accountAlias: string;

  @Column('bool', { default: true, select: false })
  isActive: boolean;

  @ManyToOne(() => Bank, (bank) => bank.mobilePayBankAccount)
  bank: Bank;
}
