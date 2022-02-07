import { Test } from '@nestjs/testing'
import { TestCase } from 'src/assignment/entities/codeChallenge/Testcase.entity'
import { TestCaseTypeResolver } from 'src/assignment/resolvers/codeChallenge/testCase/testCaseType.resolver'
import { TestCaseService } from 'src/assignment/services/codeChallenge/testCase.service'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { baseServiceMock } from 'src/common/mock/baseServiceMock'
import { guardMock } from 'src/common/mock/guardMock'
import {
  createCodeChallengeEntityMock,
  createTestCaseEntityMock,
} from 'src/common/mock/mockEntity'

const testCaseServiceMock = {
  ...baseServiceMock,
}

describe('TestCaseTypeResolver', () => {
  let resolver: TestCaseTypeResolver
  beforeAll(async () => {
    const testingModule = Test.createTestingModule({
      providers: [TestCaseTypeResolver, TestCaseService],
    })

    testingModule
      .overrideProvider(TestCaseService)
      .useValue(testCaseServiceMock)
    testingModule.overrideGuard(AuthGuard).useValue(guardMock)

    const compliedModule = await testingModule.compile()

    resolver = compliedModule.get(TestCaseTypeResolver)
  })

  let testCase: TestCase

  beforeEach(() => {
    testCase = createTestCaseEntityMock()
    jest.spyOn(testCaseServiceMock, 'findById').mockResolvedValue(testCase)
  })

  describe('assignment', () => {
    it('It should return codeChallenge', async () => {
      testCase.codeChallenge = createCodeChallengeEntityMock()

      const result = await resolver.assignment(testCase)

      expect(result).toEqual(createCodeChallengeEntityMock())
    })
  })
})
