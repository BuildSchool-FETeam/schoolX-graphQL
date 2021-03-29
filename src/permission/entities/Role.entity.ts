import { AdminUser } from 'src/AdminUser/AdminUser.entity';
import { Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { PermissionSet } from './Permission.entity';

@Entity()
export class Role {
  @PrimaryColumn({ unique: true })
  name: string;

  @OneToOne(() => PermissionSet, (permissionSet) => permissionSet.role, {
    onDelete: 'CASCADE',
  })
  permissionSet: PermissionSet;

  @OneToMany(() => AdminUser, (adminUser) => adminUser.role, {
    onDelete: 'CASCADE',
  })
  adminUser: AdminUser;
}
