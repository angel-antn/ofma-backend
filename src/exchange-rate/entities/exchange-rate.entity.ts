import { Order } from 'src/order/entities/order.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('ExchangeRate')
export class ExchangeRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float')
  rate: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Order, (order) => order.exchangeRate, { cascade: true })
  orders?: Order[];
}
