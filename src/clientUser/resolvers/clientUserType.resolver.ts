import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import * as _ from 'lodash';
import { ClientUser } from '../entities/ClientUser.entity';
import { AchievementService } from '../services/achievement.service';
import { ClientUserService } from '../services/clientUser.service';

@Resolver('ClientUserType')
export class clientUserTypeResolver {
  constructor(
    private clientUserService: ClientUserService,
    private achiService: AchievementService,
  ) {}

  @ResolveField('instructor')
  async instructor(@Parent() clientUserData: ClientUser) {
    const data = await this.clientUserService.findById(clientUserData.id, {
      relations: ['instructor'],
    });

    return data.instructor;
  }

  @ResolveField('achievement')
  async achievement(@Parent() clientUserData: ClientUser) {
    const achiData = await this.achiService.findWithOptions({
      where: { clientUser: clientUserData },
    });

    return { ..._.first(achiData) };
  }
}
