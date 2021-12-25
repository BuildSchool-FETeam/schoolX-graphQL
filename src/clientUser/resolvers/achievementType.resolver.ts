import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { PaginationInput } from 'src/graphql'
import { Achievement } from '../entities/Achivement.entity'
import { AchievementService } from '../services/achievement.service'

@Resolver('AchievementType')
export class AchievementTypeResolver {
  constructor(private achiService: AchievementService) {}

  @ResolveField('joinedCourse')
  async getCoursesStudentJoined(
    @Parent() { id: achiId }: Achievement,
    @Args('pagination') pg: PaginationInput
  ) {
    const data = await this.achiService.findById(achiId, {
      relations: ['joinedCourse'],
    })

    return this.achiService.manuallyPagination(data.joinedCourse, pg)
  }

  @ResolveField('follow')
  async getPeopleStudentFollow(
    @Parent() { id: achiId }: Achievement,
    @Args('pagination') pg: PaginationInput
  ) {
    const data = await this.achiService.findById(achiId, {
      relations: ['follow'],
    })

    return this.achiService.manuallyPagination(data.follow, pg)
  }

  @ResolveField('followedBy')
  async getPeopleFollowedMe(
    @Parent() { id: achiId }: Achievement,
    @Args('pagination') pg: PaginationInput
  ) {
    const data = await this.achiService.findById(achiId, {
      relations: ['followedBy'],
    })

    return this.achiService.manuallyPagination(data.followedBy, pg)
  }

  @ResolveField('completedCourses')
  async getAllCoursesCompleted(
    @Parent() { id: achiId }: Achievement,
    @Args('pagination') pg: PaginationInput
  ) {
    const data = await this.achiService.findById(achiId, {
      relations: ['completedCourses'],
    })

    return this.achiService.manuallyPagination(data.completedCourses, pg)
  }
}
