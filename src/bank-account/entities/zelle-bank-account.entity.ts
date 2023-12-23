import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column('bool', { default: true, select: false })
  isActive: boolean;
}
