import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
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
  startdate: Date;

  @Column('text')
  description: string;

  @Column('bool', { default: true, select: false })
  isActive: boolean;

  @Column('bool', { default: false })
  isHighlighted: boolean;

  @Column('text')
  gender: string;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeData() {
    this.name = this.name.toLowerCase();
    this.lastname = this.lastname.toLowerCase();
    this.gender = this.gender.toLowerCase();
    this.email = this.email.toLowerCase();
  }
}
