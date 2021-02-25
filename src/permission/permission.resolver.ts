import { RoleService } from './services/role.service';
import { Mutation, Resolver, Args, ResolveField } from '@nestjs/graphql';
import { Permission, PermissionSetInput } from 'src/graphql';
import { PermissionService } from './services/permission.service';
import * as _ from 'lodash';
import { PermissionSet } from './entities/Permission.entity';
import { Role } from './entities/Role.entity';

@Resolver('PermissionMutation')
export class PermissionResolver {
  constructor(
    private permissionService: PermissionService,
    private roleService: RoleService
  ) { }

  @Mutation()
  permissionMutation () {
    return {};
  }

  @ResolveField()
  async setPermission (
    @Args('data') data: PermissionSetInput,
    @Args('id') id: string,
  ) {
    let savedPermission: PermissionSet;
    const permissionSetWithoutName = _.omit(data, 'roleName') as Permission;
    let role: Role;

    if (!id) {
      savedPermission = await this.permissionService.createPermission({ ...permissionSetWithoutName });
      role = await this.roleService.createRole(data.roleName, savedPermission);
    } else {
      savedPermission = await this.permissionService.updatePermission(id, { ...permissionSetWithoutName });
      role = (await this.roleService.findRoles({ relations: ['permissionSet'] }))[0]
    }

    return {
      ...savedPermission,
      roleName: role.name
    };
  }

  @ResolveField()
  async deletePermission (@Args('id') id: string) {
    const permissions = await this.permissionService.deletePermission(id);
    return !!permissions
  }
}
