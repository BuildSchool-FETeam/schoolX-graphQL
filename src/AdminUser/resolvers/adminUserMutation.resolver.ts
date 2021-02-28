import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator';
import { AdminUserSetInput } from 'src/graphql';
import { AdminUser } from '../AdminUser.entity';
import { AdminUserService } from '../services/AdminUser.service';

@Resolver('AdminUserMutation')
export class AdminUserMutationResolver {
  constructor(private adminUserService: AdminUserService) {}

  @Mutation()
  adminUserMutation() {
    return {};
  }

  @PermissionRequire({ user: ['C', 'R'] })
  @ResolveField()
  async setAdminUser(
    @Args('data') data: AdminUserSetInput,
    @Args('id') id?: string,
  ) {
    let user: AdminUser;
    if (!id) {
      user = await this.adminUserService.createUser(data);
    } else {
      user = await this.adminUserService.updateUser(id, data);
    }

    return {
      ...user,
      role: user.role.name,
    };
  }

  @PermissionRequire({ user: ['D'] })
  @ResolveField()
  async deleteAdminUser(@Args('id') id?: string) {
    const result = await this.adminUserService.deleteOneById(id);

    return !!result;
  }
}
