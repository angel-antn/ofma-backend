import { Bank } from 'src/bank/entities/bank.entity';
import { Order } from 'src/order/entities/order.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column('bool', { default: true })
  isShown: boolean;

  @ManyToOne(() => Bank, (bank) => bank.transferBankAccount)
  bank: Bank;

  @OneToMany(() => Order, (order) => order.transferBankAccount, {
    cascade: true,
  })
  orders?: Order[];
}
