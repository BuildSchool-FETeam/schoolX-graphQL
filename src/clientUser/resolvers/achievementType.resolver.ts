import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Achievement } from '../entities/Achivement.entity';
import { AchievementService } from '../services/achievement.service';

@Resolver('AchievementType')
export class AchievementTypeResolver {
  constructor(private achiService: AchievementService) {}

  @ResolveField('joinedCourse')
  async getCoursesStudentJoined(@Parent() { id: achiId }: Achievement) {
    const data = await this.achiService.findById(achiId, {
      relations: ['joinedCourse'],
    });

    return data.joinedCourse;
  }

  @ResolveField('follow')
  async getPeopleStudentFollow(@Parent() { id: achiId }: Achievement) {
    const data = await this.achiService.findById(achiId, {
      relations: ['follow'],
    });

    return data.follow;
  }

  @ResolveField('followedBy')
  async getPeopleFollowedMe(@Parent() { id: achiId }: Achievement) {
    const data = await this.achiService.findById(achiId, {
      relations: ['followedBy'],
    });

    return data.followedBy;
  }

  @ResolveField('completedCourses')
  async getAllCoursesCompleted(@Parent() { id: achiId }: Achievement) {
    const data = await this.achiService.findById(achiId, {
      relations: ['completedCourses'],
    });

    return data.completedCourses;
  }
}
