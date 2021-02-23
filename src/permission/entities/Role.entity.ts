import {
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { PermissionSet } from './Permission.entity';

@Entity()
export class Role {
  @PrimaryColumn({ unique: true })
  name: string;

  @OneToOne(() => PermissionSet)
  @JoinColumn()
  permissionSet: PermissionSet;
}
