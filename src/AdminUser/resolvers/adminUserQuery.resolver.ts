import { AdminUserService } from 'src/AdminUser/services/AdminUser.service';
import { Resolver, Query, ResolveField, Args } from "@nestjs/graphql";

@Resolver('AdminUserQuery')
export class AdminUserQueryResolver {
  constructor(
    private adminUserService: AdminUserService
  ) { }

  @Query()
  adminUserQuery () {
    return {}
  }

  @ResolveField()
  getAllAdminUsers () {
    return this.adminUserService.findWithOptions()
  }

  @ResolveField()
  getAdminUserById (@Args('id') id: string) {
    return this.adminUserService.findById(id);
  }
}