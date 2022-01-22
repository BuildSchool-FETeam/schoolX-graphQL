import { Test } from '@nestjs/testing'
import { TestCase } from 'src/assignment/entities/codeChallenge/Testcase.entity'
import { TestCaseQueryResolver } from 'src/assignment/resolvers/codeChallenge/testCase/testCaseQuery.resolver'
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

describe('TestCaseQuery', () => {
  let resolver: TestCaseQueryResolver
  beforeAll(async () => {
    const testingModule = Test.createTestingModule({
      providers: [TestCaseQueryResolver, TestCaseService],
    })

    testingModule
      .overrideProvider(TestCaseService)
      .useValue(testCaseServiceMock)
    testingModule.overrideGuard(AuthGuard).useValue(guardMock)

    const compiledModule = await testingModule.compile()

    resolver = compiledModule.get(TestCaseQueryResolver)
  })

  let testCase: TestCase

  beforeEach(() => {
    testCase = createTestCaseEntityMock({
      codeChallenge: createCodeChallengeEntityMock(),
    })
  })

  describe('testCaseQuery', () => {
    it('It should return empty object', async () => {
      expect(resolver.testCaseQuery()).toEqual({})
    })
  })

  describe('getTestCaseById', () => {
    it('It should return testCase', async () => {
      jest.spyOn(testCaseServiceMock, 'findById').mockResolvedValue(testCase)

      const result = await resolver.getTestCaseById('id')

      expect(result).toEqual(
        createTestCaseEntityMock({
          codeChallenge: createCodeChallengeEntityMock(),
        })
      )
    })
  })
})
