import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { TestCaseService } from 'src/assignment/services/codeChallenge/testCase.service';

@Resolver('TestCaseQuery')
export class TestCaseQueryResolver {
  constructor(private testCaseService: TestCaseService) {}

  @Query()
  testCaseQuery() {
    return {};
  }

  @ResolveField('testCase')
  async getTestCaseById(@Args('id') id: string) {
    const testCase = await this.testCaseService.findById(id, {
      relations: ['codeChallenge'],
    });

    return testCase;
  }
}
