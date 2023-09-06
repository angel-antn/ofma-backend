import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  email: string;
  @Column('text', { select: false })
  password: string;
  @Column('text')
  name: string;
  @Column('text')
  lastname: string;
  @Column('bool', { default: true, select: false })
  isActive: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  checkFieldsBefore() {
    this.email = this.email.toLowerCase().trim();
    this.name = this.name.toLocaleLowerCase().trim();
    this.lastname = this.lastname.toLocaleLowerCase().trim();
  }
}
