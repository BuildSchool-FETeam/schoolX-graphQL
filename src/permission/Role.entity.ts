import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionSet } from './Permission.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  role: string;

  @OneToOne(() => PermissionSet)
  @JoinColumn()
  permissionSet: PermissionSet;
}
