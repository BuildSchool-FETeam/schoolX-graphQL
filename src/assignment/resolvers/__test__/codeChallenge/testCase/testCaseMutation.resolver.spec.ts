import { Test } from '@nestjs/testing'
import { TestCase } from 'src/assignment/entities/codeChallenge/Testcase.entity'
import { TestCaseMutationResolver } from 'src/assignment/resolvers/codeChallenge/testCase/testCaseMutation.resolver'
import { TestCaseService } from 'src/assignment/services/codeChallenge/testCase.service'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { baseServiceMock } from 'src/common/mock/baseServiceMock'
import { guardMock } from 'src/common/mock/guardMock'
import { createTestCaseEntityMock } from 'src/common/mock/mockEntity'
import { ProgrammingLanguage, TestCaseSetInput } from 'src/graphql'

const testCaseServiceMock = {
  async createTestCase() {
    return Promise.resolve({})
  },

  async updateTestCase() {
    return Promise.resolve({})
  },

  async deleteOneById() {
    return Promise.resolve({})
  },
}

describe('TestCaseMutationResolver', () => {
  let resolver: TestCaseMutationResolver
  beforeAll(async () => {
    const testingModule = Test.createTestingModule({
      providers: [TestCaseMutationResolver, TestCaseService],
    })

    testingModule
      .overrideProvider(TestCaseService)
      .useValue(testCaseServiceMock)
    testingModule.overrideGuard(AuthGuard).useValue(guardMock)

    const compiledModule = await testingModule.compile()

    resolver = compiledModule.get(TestCaseMutationResolver)
  })
  let data: TestCaseSetInput

  beforeEach(() => {
    data = {
      title: 'Test Case 1',
      runningTestScript: 'script',
      expectResult: 'result',
      codeChallengeId: '1',
      generatedExpectResultScript: null,
      programingLanguage: ProgrammingLanguage.javascript,
      timeEvaluation: 300,
    }
  })

  describe('testCaseMutation', () => {
    it('It should return empty object', () => {
      expect(resolver.testCaseMutation()).toEqual({})
    })
  })

  describe('setTestCase', () => {
    let testCase: TestCase

    beforeEach(() => {
      testCase = createTestCaseEntityMock()
    })
    it("If id doesn't exist, it should create new testCase", async () => {
      const createTestCase = jest
        .spyOn(testCaseServiceMock, 'createTestCase')
        .mockResolvedValue(testCase)

      const result = await resolver.setTestCase(data, null)

      expect(result).toEqual(createTestCaseEntityMock())
      expect(createTestCase).toHaveBeenCalled()
    })

    it('It should update testCase', async () => {
      const updateTestCase = jest
        .spyOn(testCaseServiceMock, 'updateTestCase')
        .mockResolvedValue(testCase)

      const result = await resolver.setTestCase(data, 'id')

      expect(result).toEqual(createTestCaseEntityMock())
      expect(updateTestCase).toHaveBeenCalled()
    })
  })

  describe('deleteTestCase', () => {
    it('It should delete testCase', async () => {
      jest
        .spyOn(testCaseServiceMock, 'deleteOneById')
        .mockImplementation(async () => true)

      const result = await resolver.deleteTestCase('id')

      expect(result).toEqual(true)
    })
  })
})
