import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('MobilePayBankAccounts')
export class MobilePayBankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  accountHolderPhone: string;

  @Column('text')
  bank: string;

  @Column('text')
  accountHolderDocument: string;

  @Column('text', { unique: true })
  accountAlias: string;

  @Column('bool', { default: true, select: false })
  isActive: boolean;
}
