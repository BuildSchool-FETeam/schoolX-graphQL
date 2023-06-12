import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { ClientUser } from '../entities/ClientUser.entity'
import { ClientUserService } from '../services/clientUser.service'
import { UserType } from 'src/common/constants/user.constant'

@Resolver('ClientUserType')
export class clientUserTypeResolver {
  constructor(private clientUserService: ClientUserService) {}

  @ResolveField('type')
  type(@Parent() clientUserData: ClientUser) {
    return UserType[clientUserData.type]
  }

  @ResolveField('achievement')
  async achievement(@Parent() clientUserData: ClientUser) {
    const data = await this.clientUserService.findById(clientUserData.id, {
      relations: {
        achievement: true,
      },
    })

    return data.achievement
  }
}
