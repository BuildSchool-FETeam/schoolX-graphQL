import { UseGuards } from '@nestjs/common';
import { Resolver, Query, ResolveField, Args } from '@nestjs/graphql';
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { PermissionService } from '../services/permission.service';

@UseGuards(AuthGuard)
@Resolver('PermissionQuery')
export class PermissionQueryResolver {
  constructor(private permissionService: PermissionService) {}

  @Query()
  @PermissionRequire({ permission: ['R'] })
  permissionQuery() {
    return {};
  }

  @ResolveField('permissions')
  async getAllPermissions() {
    const permissions = await this.permissionService.findWithOptions({
      relations: ['role'],
    });
    return permissions.map((item) => {
      return {
        ...item,
        roleName: item.role.name,
      };
    });
  }

  @ResolveField('permissionWithId')
  async getPermissionById(@Args('id') id: string) {
    const permission = await this.permissionService.findById(id, {
      relations: ['role'],
    });
    return {
      ...permission,
      roleName: permission.role.name,
    };
  }

  @ResolveField('permissionWithRole')
  async getPermissionByRole(@Args('roleName') roleName: string) {
    const permissionSet = await this.permissionService.getPermissionByRole(
      roleName,
    );
    return {
      ...permissionSet,
      roleName: permissionSet.role.name,
    };
  }
}
