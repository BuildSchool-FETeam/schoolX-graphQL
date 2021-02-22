
import { PermissionSet } from './entities/Permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PermissionService } from './services/permission.service';
import { RoleService } from './services/role.service';
import { Role } from './entities/Role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionSet, Role])],
  providers: [PermissionService, RoleService],
  exports: [PermissionService, RoleService]
})
export class PermissionModule { }
