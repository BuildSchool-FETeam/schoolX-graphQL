import { AdminUserService } from 'src/AdminUser/services/AdminUser.service';
import { Resolver, Query, ResolveField, Args } from '@nestjs/graphql';
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator';

@Resolver('AdminUserQuery')
export class AdminUserQueryResolver {
  constructor(private adminUserService: AdminUserService) {}

  @Query()
  @PermissionRequire({ user: ['R'] })
  adminUserQuery() {
    return {};
  }

  @ResolveField()
  adminUsers () {
    return this.adminUserService.findWithOptions();
  }

  @ResolveField()
  adminUser (@Args('id') id: string) {
    return this.adminUserService.findById(id);
  }
}
