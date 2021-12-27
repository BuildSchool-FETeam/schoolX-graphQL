import { TypeOrmModule } from '@nestjs/typeorm'
import { forwardRef, Module } from '@nestjs/common'
import { CommonModule } from 'src/common/Common.module'
import { AdminUserModule } from 'src/adminUser/AdminUser.module'
import { PermissionSet } from './entities/Permission.entity'
import { PermissionService } from './services/permission.service'
import { RoleService } from './services/role.service'
import { Role } from './entities/Role.entity'
import { PermissionMutationResolver } from './resolvers/permissionMutation.resolver'
import { PermissionQueryResolver } from './resolvers/permissionQuery.resolver'

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionSet, Role]),
    forwardRef(() => CommonModule),
    forwardRef(() => AdminUserModule),
  ],
  providers: [
    PermissionService,
    RoleService,
    PermissionMutationResolver,
    PermissionQueryResolver,
  ],
  exports: [PermissionService, RoleService],
})
export class PermissionModule {}
