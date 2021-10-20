import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { CodeChallenge } from 'src/assignment/entities/CodeChallenge.entity';
import { TestCaseProgrammingLanguage } from 'src/assignment/entities/Testcase.entity';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AssignmentSetInput, CodeChallengeSetInput, CodeConfigInput } from 'src/graphql';
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
  async createCodeChallenge(
    @Args('data') codeChallenge: CodeChallengeSetInput,
    @Args('dataAssign') dataAssign: AssignmentSetInput 
  ) {
    if(!codeChallenge.assignmentId && !dataAssign) {
      throw new BadRequestException("Assignment no existed, must have dataAssign to create Assignment")
    }
    return this.assignmentService.createCodeChallenge(codeChallenge, dataAssign);
  }

  async updateCodeChallenge(
    @Args('id') id: string,
    @Args('data') data: CodeChallengeSetInput
  ){

  }

  async deleteCodeChallenge(
    @Args('id') id: string,
  ){

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
    @Args('challengeId') challengeId: string,
    @Args('data') data: CodeConfigInput,
  ) {
    return this.assignmentService.runTestCase(challengeId, data);
  }
}
