import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './Role.entity';

@Entity()
export class PermissionSet {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  course: string;

  @Column()
  user: string;

  @Column()
  blog: string;

  @Column()
  instructor: string;

  @Column()
  permission: string;

  @Column()
  notification: string;

  @OneToOne(() => Role, (role) => role.permissionSet, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  role: Role;
}
