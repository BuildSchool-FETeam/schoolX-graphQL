import { Mutation, Resolver, Args, ResolveField } from '@nestjs/graphql';
import { PermissionSetInput } from 'src/graphql';
import { PermissionService } from './services/permission.service';
import { PermissionSet } from './entities/Permission.entity';

@Resolver('PermissionMutation')
export class PermissionMutationResolver {
  constructor(
    private permissionService: PermissionService,
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
    let result: {
      name: string;
      permissionSet: PermissionSet;
    }
    if (!id) {
      result = await this.permissionService.createPermission(data)
    } else {
      result = await this.permissionService.updatePermission(id, data);
    }

    return {
      ...result.permissionSet,
      roleName: result.name
    };
  }

  @ResolveField()
  async deletePermission (@Args('id') id: string) {
    const permissions = await this.permissionService.deleteOneById(id);
    return !!permissions;
  }
}
