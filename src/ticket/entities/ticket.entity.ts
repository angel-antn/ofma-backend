import { Concert } from 'src/concert/entities/concert.entity';
import { Order } from 'src/order/entities/order.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Tickets' })
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('bool', { default: false })
  isUsed: boolean;

  @ManyToOne(() => Concert, (concert) => concert.tickets)
  concert: Concert;

  @ManyToOne(() => Order, (order) => order.tickets)
  order: Order;
}
