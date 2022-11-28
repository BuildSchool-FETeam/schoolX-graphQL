import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { Assignment } from 'src/assignment/entities/Assignment.entity'
import { AssignmentService } from 'src/assignment/services/assignment.service'
import { PaginationInput } from '../../graphql'

@Resolver('AssignmentType')
export class AssignmentTypeResolver {
  constructor(private assignmentService: AssignmentService) {}

  @ResolveField()
  async lesson(@Parent() parent: Assignment) {
    const assignment = await this.assignmentService.findById(parent.id, {
      relations: {
        lesson: true,
      },
    })

    return assignment.lesson
  }

  @ResolveField()
  async comments(
    @Parent() parent: Assignment,
    @Args('pagination') pg: PaginationInput
  ) {
    const assignment = await this.assignmentService.findById(parent.id, {
      select: ['id'],
      relations: { comments: true },
    })

    return this.assignmentService.manuallyPagination(assignment.comments, pg)
  }

  @ResolveField()
  async codeChallenges(@Parent() parent: Assignment) {
    const assignment = await this.assignmentService.findById(parent.id, {
      relations: { codeChallenges: true },
    })

    return assignment.codeChallenges
  }

  @ResolveField()
  async quizs(@Parent() parent: Assignment) {
    const assignment = await this.assignmentService.findById(parent.id, {
      relations: { quizs: true },
    })

    return assignment.quizs
  }

  @ResolveField()
  async fileAssignments(@Parent() parent: Assignment) {
    const assignment = await this.assignmentService.findById(parent.id, {
      relations: { fileAssignments: true },
    })

    return assignment.fileAssignments
  }
}
