import { PaginationInput } from '../../graphql';
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Assignment } from 'src/assignment/entities/Assignment.entity';
import { AssignmentService } from 'src/assignment/services/assignment.service';

@Resolver('AssignmentType')
export class AssignmentTypeResolver {
  constructor(private assignmentService: AssignmentService) {}

  @ResolveField()
  async lesson(@Parent() parent: Assignment) {
    const assignment = await this.assignmentService.findById(parent.id, {
      relations: ['lesson'],
    });

    return assignment.lesson;
  }
  @ResolveField()
  async comments(
    @Parent() parent: Assignment,
    @Args('pagination') pg: PaginationInput
  ) {
    const assignment = await this.assignmentService.findById(parent.id, {
      select: ['id'],
      relations: ['comments'],
    });

    return this.assignmentService.manuallyPagination(assignment.comments, pg);
  }

  @ResolveField()
  async codeChallenges(
    @Parent() parent: Assignment,
    @Args('pagination') pg: PaginationInput
  ) {
    const assignment = await this.assignmentService.findById(parent.id, {
      relations: ["codeChallenges"]
    })

    return this.assignmentService.manuallyPagination(assignment.codeChallenges, pg);
  }
}
