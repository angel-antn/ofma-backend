import { Bank } from 'src/bank/entities/bank.entity';
import { Order } from 'src/order/entities/order.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column('bool', { default: true })
  isShown: boolean;

  @ManyToOne(() => Bank, (bank) => bank.mobilePayBankAccount)
  bank: Bank;

  @OneToMany(() => Order, (order) => order.mobilePayBankAccount, {
    cascade: true,
  })
  orders?: Order[];
}
