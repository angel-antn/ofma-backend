import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ExclusiveContentMusician } from './exclusive-content-musician.entity';

@Entity('ExclusiveContents')
export class ExclusiveContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  category: string;

  @Column('bool', { default: true, select: false })
  isActive: boolean;

  @Column('bool', { default: false })
  isHighlighted: boolean;

  @Column('bool', { default: false })
  isPublished: boolean;

  @Column('bool', { default: true })
  isDraft: boolean;

  //relations
  @OneToMany(
    () => ExclusiveContentMusician,
    (exclusiveContentMusician) => exclusiveContentMusician.exclusiveContent,
    { cascade: true },
  )
  exclusiveContentMusician?: ExclusiveContentMusician[];
}
