import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import * as _ from 'lodash';
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AdminUserSetInput } from 'src/graphql';
import { AdminUser } from '../AdminUser.entity';
import { AdminUserService } from '../services/AdminUser.service';

@UseGuards(AuthGuard)
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
    @Context() { req }: any,
    @Args('id') id?: string,
  ) {
    const token = _.split(req.headers.authorization, ' ')[1];
    let user: AdminUser;
    if (!id) {
      user = await this.adminUserService.createUser(data, token);
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
