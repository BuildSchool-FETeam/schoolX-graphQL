import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { TestCaseService } from 'src/assignment/services/testCase.service';
import { TestCaseSetInput } from 'src/graphql';

@Resolver('TestCaseMutation')
export class TestCaseMutationResolver {
  constructor(private tcService: TestCaseService) {}

  @Mutation()
  testCaseMutation() {
    return {};
  }

  @ResolveField()
  setTestCase(@Args('data') data: TestCaseSetInput, @Args('id') id: string) {
    if (!id) {
      return this.tcService.createTestCase(data);
    } else {
      return this.tcService.updateTestCase(id, data);
    }
  }

  @ResolveField()
  deleteTestCase(@Args('id') id: string) {
    return !!this.tcService.deleteOneById(id);
  }
}
