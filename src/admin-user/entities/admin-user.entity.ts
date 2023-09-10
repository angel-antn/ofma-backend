import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
