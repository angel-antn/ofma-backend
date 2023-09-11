import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Concerts')
export class Concert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('date', { array: true })
  date: Date[];

  @Column('bool', { default: true, select: false })
  isActive: boolean;

  @Column('double precision')
  lon: number;

  @Column('double precision')
  lat: number;

  @Column('text')
  description: string;

  @Column('int')
  entriesQty: number;
}
