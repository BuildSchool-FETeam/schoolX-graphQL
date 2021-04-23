import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AssignmentService } from 'src/assignment/services/assignment.service';

@Resolver('AssignmentQuery')
export class AssignmentQueryResolver {
  constructor(private assignmentService: AssignmentService) {}

  @Query()
  assignmentQuery() {
    return {};
  }

  @ResolveField('assignment')
  async getAssignment(@Args('id') id: string) {
    return this.assignmentService.findById(id);
  }
}
