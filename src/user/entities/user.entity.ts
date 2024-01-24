import { Order } from 'src/order/entities/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
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

  @Column('bool', { default: false })
  isCollaborator: boolean;

  @Column('text', { nullable: true, select: false })
  resetPasswordOtp: string;

  @Column('date', { nullable: true, select: false })
  premiumUntil: Date;

  role: string;

  @OneToMany(() => Order, (order) => order.user, { cascade: true })
  orders?: Order[];

  @BeforeInsert()
  @BeforeUpdate()
  checkFieldsBefore() {
    this.email = this.email.toLowerCase().trim();
    this.name = this.name.toLocaleLowerCase().trim();
    this.lastname = this.lastname.toLocaleLowerCase().trim();
  }
}
