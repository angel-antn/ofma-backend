import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Musicians')
export class Musician {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  lastname: string;

  @Column('date')
  birthdate: Date;

  @Column('text')
  description: string;

  @Column('bool', { default: true, select: false })
  isActive: boolean;

  @Column('bool', { default: false })
  isHighlighted: boolean;
}
