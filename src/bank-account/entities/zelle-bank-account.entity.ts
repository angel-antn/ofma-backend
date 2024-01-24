import { Order } from 'src/order/entities/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ZelleBankAccounts')
export class ZelleBankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  accountHolderEmail: string;

  @Column('text')
  accountHolderName: string;

  @Column('text', { unique: true })
  accountAlias: string;

  @Column('bool', { default: true })
  isShown: boolean;

  @Column('bool', { default: true, select: false })
  isActive: boolean;

  @OneToMany(() => Order, (order) => order.zelleBankAccount, {
    cascade: true,
  })
  orders?: Order[];
}
