import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ExclusiveContents')
export class ExclusiveContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('bool', { default: true, select: false })
  isActive: boolean;

  @Column('bool', { default: false })
  isHighlighted: boolean;
}
