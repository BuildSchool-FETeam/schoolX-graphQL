import { UseGuards } from '@nestjs/common';
import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { TestCaseProgrammingLanguage } from 'src/assignment/entities/Testcase.entity';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AssignmentSetInput, CodeConfigInput } from 'src/graphql';
import { Assignment } from '../../entities/Assignment.entity';
import { AssignmentService } from '../../services/assignment.service';

@UseGuards(AuthGuard)
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
    await this.assignmentService.deleteOneById(id);
    return true;
  }

  @ResolveField()
  async runCode(
    @Args('code') code: string,
    @Args('language') language: TestCaseProgrammingLanguage,
  ) {
    return this.assignmentService.runCode(code, language);
  }

  @ResolveField()
  async runTestCase(
    @Args('assignmentId') assignmentId: string,
    @Args('data') data: CodeConfigInput,
  ) {
    return this.assignmentService.runTestCase(assignmentId, data);
  }
}
