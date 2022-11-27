import { AdminUserService } from 'src/adminUser/services/AdminUser.service'
import { Resolver, ResolveField, Parent } from '@nestjs/graphql'
import { AdminUser } from '../AdminUser.entity'

@Resolver('AdminUser')
export class AdminUserTypeResolver {
  constructor(private adminUserService: AdminUserService) {}

  @ResolveField()
  async role(@Parent() admin: AdminUser) {
    const parentAdmin = await this.adminUserService.findById(admin.id, {
      relations: { role: true },
    })

    return parentAdmin.role.name
  }

  @ResolveField()
  async createdBy(@Parent() admin: AdminUser) {
    const parentAdmin = await this.adminUserService.findById(admin.id, {
      relations: { createdBy: true },
    })

    return parentAdmin.createdBy
  }

  @ResolveField()
  async evaluationComments(@Parent() admin: AdminUser) {
    const parentAdmin = await this.adminUserService.findById(admin.id, {
      relations: { evaluationComments: true },
    })

    return parentAdmin.evaluationComments
  }
}
