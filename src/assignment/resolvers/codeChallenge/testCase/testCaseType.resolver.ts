import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { TestCase } from 'src/assignment/entities/codeChallenge/Testcase.entity';
import { TestCaseService } from 'src/assignment/services/codeChallenge/testCase.service';

@Resolver('TestCaseType')
export class TestCaseTypeResolver {
  constructor(private tcService: TestCaseService) {}

  @ResolveField()
  async codeChallenge(@Parent() tcParent: TestCase) {
    const testCase = await this.tcService.findById(tcParent.id, {
      relations: ['codeChallenge'],
    });

    return testCase.codeChallenge;
  }
}
