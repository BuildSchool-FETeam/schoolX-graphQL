import { Resolver, Query, ResolveField, Args } from '@nestjs/graphql';
import { PermissionService } from './services/permission.service';

@Resolver('PermissionQuery')
export class PermissionQueryResolver {
  constructor(private permissionService: PermissionService) {}

  @Query()
  permissionQuery() {
    return {};
  }

  @ResolveField()
  async getAllPermissions() {
    const permissions = await this.permissionService.getPermissions({
      relations: ['role'],
    });
    return permissions.map((item) => {
      return {
        ...item,
        roleName: item.role.name,
      };
    });
  }

  @ResolveField()
  async getPermissionById(@Args('id') id: string) {
    const permission = await this.permissionService.getPermissionById(id, {
      relations: ['role'],
    });
    return {
      ...permission,
      roleName: permission.role.name,
    };
  }
}
