import { PermissionSet } from './entities/Permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { PermissionService } from './services/permission.service';
import { RoleService } from './services/role.service';
import { Role } from './entities/Role.entity';
import { PermissionMutationResolver } from './permissionMutation.resolver';
import { PermissionQueryResolver } from './permissionQuery.resolver';
import { CommonModule } from 'src/common/Common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionSet, Role]),
    forwardRef(() => CommonModule),
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
