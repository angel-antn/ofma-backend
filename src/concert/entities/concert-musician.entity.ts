import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Concert } from './concert.entity';
import { Musician } from 'src/musician/entities/musician.entity';

@Entity({ name: 'Concert-Musician' })
export class ConcertMusician {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Musician, (musician) => musician.concertMusician)
  musician: Musician;

  @ManyToOne(() => Concert, (concert) => concert.concertMusician)
  concert: Concert;

  @Column('text')
  role: string;

  @BeforeInsert()
  @BeforeUpdate()
  checkFieldsBefore() {
    this.role = this.role.toLowerCase().trim();
  }
}
