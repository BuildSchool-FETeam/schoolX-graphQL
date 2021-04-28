import { SearchOptionInput } from './../../graphql';
import { AuthGuard } from './../../common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { AdminUserService } from 'src/adminUser/services/AdminUser.service';
import { Resolver, Query, ResolveField, Args, Context } from '@nestjs/graphql';
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator';
import { PaginationInput } from 'src/graphql';

@UseGuards(AuthGuard)
@Resolver('AdminUserQuery')
export class AdminUserQueryResolver {
  constructor(private adminUserService: AdminUserService) {}

  @Query()
  @PermissionRequire({ user: ['R'] })
  adminUserQuery() {
    return {};
  }

  @ResolveField()
  @PermissionRequire({ user: ['R'] })
  async adminUsers(
    @Context() { req }: any,
    @Args('pagination') pg: PaginationInput,
    @Args('searchOption') sOpt: SearchOptionInput
  ) {
    const token = this.adminUserService.getTokenFromHttpHeader(req.headers);

    const pgOptions = this.adminUserService.buildPaginationOptions(pg);
    const searchOpt = this.adminUserService.buildSearchOptions(sOpt);

    const data = this.adminUserService.findWithOptions(
      { ...pgOptions, ...searchOpt },
      { token, strictResourceName: 'user' },
    );
    return data;
  }

  @ResolveField()
  @PermissionRequire({ user: ['R'] })
  adminUser(@Args('id') id: string, @Context() { req }: any) {
    const token = this.adminUserService.getTokenFromHttpHeader(req.headers);

    return this.adminUserService.findById(
      id,
      {},
      { token, strictResourceName: 'user' },
    );
  }
}
