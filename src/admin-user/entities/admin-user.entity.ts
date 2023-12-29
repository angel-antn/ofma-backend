import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('AdminUsers')
export class AdminUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('bool', { default: true, select: false })
  isActive: boolean;

  @Column('text', { nullable: true, select: false })
  resetPasswordOtp: string;

  role: string;

  @BeforeInsert()
  @BeforeUpdate()
  checkFieldsBefore() {
    this.email = this.email.toLowerCase().trim();
  }
}
