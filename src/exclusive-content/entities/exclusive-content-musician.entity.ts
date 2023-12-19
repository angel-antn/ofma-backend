import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ExclusiveContent } from './exclusive-content.entity';
import { Musician } from 'src/musician/entities/musician.entity';

@Entity({ name: 'ExclusiveContent-Musician' })
export class ExclusiveContentMusician {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Musician, (musician) => musician.exclusiveContentMusician)
  musician: Musician;

  @ManyToOne(
    () => ExclusiveContent,
    (exclusiveContent) => exclusiveContent.exclusiveContentMusician,
  )
  exclusiveContent: ExclusiveContent;

  @Column('text')
  role: string;

  @BeforeInsert()
  @BeforeUpdate()
  checkFieldsBefore() {
    this.role = this.role.toLowerCase().trim();
  }
}
