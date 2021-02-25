import { Mutation, Resolver, Args, ResolveField } from '@nestjs/graphql';
import { Permission, PermissionSetInput } from 'src/graphql';
import { PermissionService } from './services/permission.service';

@Resolver('PermissionMutation')
export class PermissionResolver {
  constructor(private permissionService: PermissionService) {}

  @Mutation()
  permissionMutation() {
    return {};
  }

  @ResolveField()
  async setPermission(
    @Args('data') data: PermissionSetInput,
    @Args('id') id: string,
  ) {
    let result: Permission;
    if (!id) {
      result = await this.permissionService.createPermission({ ...data });
    } else {
      result = await this.permissionService.updatePermission(id, { ...data });
    }

    return result;
  }
}
