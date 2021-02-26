import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { AdminUserSetInput } from 'src/graphql';
import { AdminUser } from './AdminUser.entity';
import { AdminUserService } from './services/AdminUser.service';

@Resolver('AdminUserMutation')
export class AdminUserMutationResolver {
  constructor(private adminUserService: AdminUserService) {}

  @Mutation()
  adminUserMutation() {
    return {};
  }

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
}
