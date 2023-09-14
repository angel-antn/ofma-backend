import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ExclusiveContents')
export class ExclusiveContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('text', { default: '' })
  videoUrl: string;

  @Column('text', { default: '' })
  imageUrl: string;

  @Column('bool', { default: true, select: false })
  isActive: boolean;
}
