import { AdminUserService } from 'src/adminUser/services/AdminUser.service';
import { Resolver, Query, ResolveField, Args, Context } from '@nestjs/graphql';
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator';
import { CacheService } from 'src/common/services/cache.service';
import { cacheConstant } from 'src/common/constants/cache.contant';
import { ICachedPermissionSet } from 'src/common/guards/permission.guard';
import { AdminUser } from '../AdminUser.entity';

@Resolver('AdminUserQuery')
export class AdminUserQueryResolver {
  constructor(
    private adminUserService: AdminUserService,
    private cacheService: CacheService,
  ) {}

  @Query()
  @PermissionRequire({ user: ['R'] })
  adminUserQuery() {
    return {};
  }

  @ResolveField()
  async adminUsers(@Context() { req }: any) {
    const token = this.adminUserService.getTokenFromHttpHeader(req.headers);
    const {
      adminUser,
      permissionSet,
    } = await this.cacheService.getValue<ICachedPermissionSet>(
      `${cacheConstant.PERMISSION}-${token}`,
    );
    let data: Promise<AdminUser[]>;

    if (
      this.adminUserService.isStrictPermission(permissionSet.user.split('|'))
    ) {
      data = this.adminUserService.findWithOptions({
        where: { createdBy: adminUser },
      });
    } else {
      data = this.adminUserService.findWithOptions();
    }

    return data;
  }

  @ResolveField()
  adminUser(@Args('id') id: string) {
    return this.adminUserService.findById(id);
  }
}
