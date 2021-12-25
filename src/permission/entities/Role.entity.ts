import { AdminUser } from 'src/adminUser/AdminUser.entity'
import { ClientUser } from 'src/clientUser/entities/ClientUser.entity'
import { Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm'
import { PermissionSet } from './Permission.entity'

@Entity()
export class Role {
  @PrimaryColumn({ unique: true })
  name: string

  @OneToOne(() => PermissionSet, (permissionSet) => permissionSet.role, {
    onDelete: 'CASCADE',
  })
  permissionSet: PermissionSet

  @OneToMany(() => AdminUser, (adminUser) => adminUser.role)
  adminUsers: AdminUser[]

  @OneToMany(() => ClientUser, (clientUser) => clientUser.role)
  clientUsers: ClientUser[]
}
