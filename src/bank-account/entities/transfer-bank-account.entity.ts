import { Bank } from 'src/bank/entities/bank.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TransferBankAccounts')
export class TransferBankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  accountNumber: string;

  @Column('text')
  accountHolderName: string;

  @Column('text')
  accountHolderEmail: string;

  @Column('text')
  accountHolderDocument: string;

  @Column('text', { unique: true })
  accountAlias: string;

  @Column('bool', { default: true, select: false })
  isActive: boolean;

  @ManyToOne(() => Bank, (bank) => bank.transferBankAccount)
  bank: Bank;
}
