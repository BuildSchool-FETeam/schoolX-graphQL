import { AuthGuard } from './../../common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { AdminUserService } from 'src/adminUser/services/AdminUser.service';
import { Resolver, Query, ResolveField, Args, Context } from '@nestjs/graphql';
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator';

@UseGuards(AuthGuard)
@Resolver('AdminUserQuery')
export class AdminUserQueryResolver {
  constructor(
    private adminUserService: AdminUserService,
  ) {}

  @Query()
  @PermissionRequire({ user: ['R'] })
  adminUserQuery() {
    return {};
  }

  @ResolveField()
  @PermissionRequire({ user: ['R'] })
  async adminUsers(@Context() { req }: any) {
    const token = this.adminUserService.getTokenFromHttpHeader(req.headers);
    const data = this.adminUserService.findWithOptions({}, {token, strictResourceName: 'user'})
    return data;
  }

  @ResolveField()
  @PermissionRequire({ user: ['R'] })
  adminUser(@Args('id') id: string, @Context() {req}: any) {
    const token = this.adminUserService.getTokenFromHttpHeader(req.headers);

    return this.adminUserService.findById(id, {}, {token, strictResourceName: 'user'});
  }
}
