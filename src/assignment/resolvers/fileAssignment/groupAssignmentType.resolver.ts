import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { GroupAssignment } from 'src/assignment/entities/fileAssignment/groupAssignment.entity'
import { GroupAssignmentService } from 'src/assignment/services/fileAssignment/groupAssignment.service'
import { PaginationInput } from 'src/graphql'

@Resolver('GroupAssignmentType')
export class GroupAssignmentTypeResolver {
  constructor(private groupAssignService: GroupAssignmentService) {}

  @ResolveField()
  async user(@Parent() group: GroupAssignment) {
    const data = await this.groupAssignService.findById(group.id, {
      relations: ['user'],
    })

    return data.user
  }

  @ResolveField()
  async submitteds(
    @Parent() group: GroupAssignment,
    @Args('pagination') pagination: PaginationInput
  ) {
    const data = await this.groupAssignService.findById(group.id, {
      relations: ['submitteds'],
    })

    return this.groupAssignService.manuallyPagination(
      data.submitteds,
      pagination
    )
  }

  @ResolveField()
  async fileAssignment(@Parent() group: GroupAssignment) {
    const data = await this.groupAssignService.findById(group.id, {
      relations: ['fileAssignment'],
    })

    return data.fileAssignment
  }
}
