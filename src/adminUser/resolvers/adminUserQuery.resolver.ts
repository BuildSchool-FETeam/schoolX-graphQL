import { UseGuards } from '@nestjs/common'
import { AdminUserService } from 'src/adminUser/services/AdminUser.service'
import { Resolver, Query, ResolveField, Args, Context } from '@nestjs/graphql'
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator'
import { PaginationInput } from 'src/graphql'
import { AuthGuard } from '../../common/guards/auth.guard'
import { SearchOptionInput } from '../../graphql'

@UseGuards(AuthGuard)
@Resolver('AdminUserQuery')
export class AdminUserQueryResolver {
  constructor(private adminUserService: AdminUserService) {}

  @Query()
  @PermissionRequire({ user: ['C:x', 'R:*', 'U:x', 'D:x'] })
  adminUserQuery() {
    return {}
  }

  @ResolveField()
  @PermissionRequire({ user: ['C:x', 'R:*', 'U:x', 'D:x'] })
  async adminUsers(
    @Context() { req }: DynamicObject,
    @Args('pagination') pg: PaginationInput,
    @Args('searchOption') sOpt: SearchOptionInput
  ) {
    const token = this.adminUserService.getTokenFromHttpHeader(req.headers)

    const pgOptions = this.adminUserService.buildPaginationOptions(pg)
    const searchOpt = this.adminUserService.buildSearchOptions(sOpt)

    const data = this.adminUserService.findWithOptions(
      { ...pgOptions, ...searchOpt },
      { token, strictResourceName: 'user' }
    )

    return data
  }

  @ResolveField()
  @PermissionRequire({ user: ['C:x', 'R:*', 'U:x', 'D:x'] })
  async adminUser(@Args('id') id: string, @Context() { req }: DynamicObject) {
    const token = this.adminUserService.getTokenFromHttpHeader(req.headers)

    return this.adminUserService.findById(
      id,
      {},
      { token, strictResourceName: 'user' }
    )
  }

  @ResolveField()
  @PermissionRequire({ user: ['C:x', 'R:*', 'U:x', 'D:x'] })
  async totalAdminUsers(@Context() { req }: DynamicObject) {
    const token = this.adminUserService.getTokenFromHttpHeader(req.headers)

    return this.adminUserService.countingTotalItem({
      token,
      strictResourceName: 'user',
    })
  }
}
