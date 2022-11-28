import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { ClientUser } from '../entities/ClientUser.entity'
import { ClientUserService } from '../services/clientUser.service'

@Resolver('ClientUserType')
export class clientUserTypeResolver {
  constructor(private clientUserService: ClientUserService) {}

  @ResolveField('instructor')
  async instructor(@Parent() clientUserData: ClientUser) {
    const data = await this.clientUserService.findById(clientUserData.id, {
      relations: { instructor: true },
    })

    return data.instructor
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
