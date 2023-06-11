import { UseGuards } from '@nestjs/common'
import { Args, ResolveField, Resolver, Query } from '@nestjs/graphql'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { ClientUserService } from '../services/clientUser.service'

@UseGuards(AuthGuard)
@Resolver('ClientUserQuery')
export class clientUserQueryResolver {
  constructor(private clientUserService: ClientUserService) {}

  @Query()
  clientUserQuery() {
    return {}
  }

  @ResolveField()
  async validateEmail(@Args('email') email: string) {
    return this.clientUserService.validateEmail(email)
  }

  @ResolveField()
  async userDetail(@Args('id') id: string) {
    return this.clientUserService.findById(id)
  }
}
