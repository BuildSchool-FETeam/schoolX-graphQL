import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { TestCase } from 'src/assignment/entities/Testcase.entity';
import { TestCaseService } from 'src/assignment/services/testCase.service';

@Resolver('TestCaseType')
export class TestCaseTypeResolver {
  constructor(private tcService: TestCaseService) {}

  @ResolveField()
  async assignment(@Parent() tcParent: TestCase) {
    const testCase = await this.tcService.findById(tcParent.id, {
      relations: ['codeChallenge'],
    });

    return testCase.codeChallenge;
  }
}
