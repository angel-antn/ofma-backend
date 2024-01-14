import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ExchangeRate')
export class ExchangeRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float')
  rate: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
