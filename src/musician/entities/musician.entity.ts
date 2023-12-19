import { ConcertMusician } from 'src/concert/entities/concert-musician.entity';
import { ExclusiveContentMusician } from 'src/exclusive-content/entities/exclusive-content-musician.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';

@Entity('Musicians')
export class Musician {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  lastname: string;

  @Column('text', { unique: true })
  email: string;

  @Column('date')
  birthdate: Date;

  @Column('date')
  startDate: Date;

  @Column('text')
  description: string;

  @Column('bool', { default: true, select: false })
  isActive: boolean;

  @Column('bool', { default: false })
  isHighlighted: boolean;

  @Column('text')
  gender: string;

  //relations
  @OneToMany(
    () => ConcertMusician,
    (concertMusician) => concertMusician.musician,
    { cascade: true },
  )
  concertMusician?: ConcertMusician[];

  @OneToMany(
    () => ExclusiveContentMusician,
    (exclusiveContentMusician) => exclusiveContentMusician.musician,
    { cascade: true },
  )
  exclusiveContentMusician?: ExclusiveContentMusician[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeData() {
    this.name = this.name.toLowerCase();
    this.lastname = this.lastname.toLowerCase();
    this.gender = this.gender.toLowerCase();
    this.email = this.email.toLowerCase();
  }
}
