import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ConcertMusician } from './concert-musician.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';

@Entity('Concerts')
export class Concert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('date')
  startDate: Date;

  @Column('time')
  startAtHour: string;

  @Column('bool', { default: true, select: false })
  isActive: boolean;

  @Column('bool', { default: true })
  isOpen: boolean;

  @Column('bool', { default: false })
  hasFinish: boolean;

  @Column('text')
  description: string;

  @Column('text')
  address: string;

  @Column('int')
  entriesQty: number;

  @Column('float')
  pricePerEntry: number;

  //relations
  @OneToMany(
    () => ConcertMusician,
    (concertMusician) => concertMusician.concert,
    { cascade: true },
  )
  concertMusician?: ConcertMusician[];

  @OneToMany(() => Ticket, (ticket) => ticket.concert, { cascade: true })
  tickets?: Ticket[];
}
