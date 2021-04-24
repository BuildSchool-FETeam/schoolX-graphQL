import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { AssignmentSetInput } from 'src/graphql';
import { Assignment } from '../../entities/Assignment.entity';
import { AssignmentService } from '../../services/assignment.service';

@Resolver('AssignmentMutation')
export class AssignmentMutationResolver {
  constructor(private assignmentService: AssignmentService) {}

  @Mutation()
  assignmentMutation() {
    return {};
  }

  @ResolveField()
  async setAssignment(
    @Args('data') data: AssignmentSetInput,
    @Args('id') id?: string,
  ) {
    let assign: Assignment;
    if (!id) {
      assign = await this.assignmentService.createAssignment({ ...data });
    } else {
      assign = await this.assignmentService.updateAssignment(id, { ...data });
    }

    return {
      ...assign,
    };
  }

  @ResolveField()
  async deleteAssignment(@Args('id') id: string) {
    return !!this.assignmentService.deleteOneById(id);
  }
}
