import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ExclusiveContents')
export class ExclusiveContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('text', { unique: true })
  url: string;

  @Column('bool', { default: true, select: false })
  isActive: boolean;
}
