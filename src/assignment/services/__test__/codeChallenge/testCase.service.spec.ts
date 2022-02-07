import { TestCase } from 'src/assignment/entities/codeChallenge/Testcase.entity'
import { Repository } from 'typeorm'
import { TestCaseService } from 'src/assignment/services/codeChallenge/testCase.service'
import { Test } from '@nestjs/testing'
import { CodeChallengeService } from '../../codeChallenge/codeChallenge.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { repositoryMockFactory } from 'src/common/mock/repositoryMock'
import {
  createCodeChallengeEntityMock,
  createTestCaseEntityMock,
} from 'src/common/mock/mockEntity'
import { ProgrammingLanguage, TestCaseSetInput } from 'src/graphql'
import { assertThrowError } from 'src/common/mock/customAssertion'
import { BadRequestException } from '@nestjs/common'
import { baseServiceMock } from 'src/common/mock/baseServiceMock'

const codeChallengeServiceMock = {
  ...baseServiceMock,
}

describe('TestCaseService', () => {
  let testCaseRepo: Repository<TestCase>
  let testCaseService: TestCaseService

  beforeAll(async () => {
    const testModule = Test.createTestingModule({
      providers: [
        CodeChallengeService,
        TestCaseService,
        {
          provide: getRepositoryToken(TestCase),
          useFactory: repositoryMockFactory,
        },
      ],
    })

    testModule
      .overrideProvider(CodeChallengeService)
      .useValue(codeChallengeServiceMock)

    const compliedModule = await testModule.compile()

    testCaseRepo = compliedModule.get(getRepositoryToken(TestCase))
    testCaseService = compliedModule.get(TestCaseService)
  })

  let data: TestCaseSetInput
  beforeEach(() => {
    data = {
      title: 'Test case 1',
      runningTestScript: 'script',
      expectResult: null,
      codeChallengeId: 'codeChallengeId',
      generatedExpectResultScript: null,
      programingLanguage: null,
      timeEvaluation: 30,
    }
  })

  describe('createTestCase', () => {
    const codeChallenge = createCodeChallengeEntityMock()

    beforeEach(() => {
      jest
        .spyOn(codeChallengeServiceMock, 'findById')
        .mockResolvedValue(codeChallenge)
    })

    it('If "generatedExpectResultScript" and "expectResult" is null, it should throw Error', async () => {
      assertThrowError(
        testCaseService.createTestCase.bind(testCaseService, data),
        new BadRequestException(
          "You should provide either 'generatedExpectResultScript' OR 'expectResult'"
        )
      )
    })

    it('It should create new testCase', async () => {
      data.expectResult = 'result'
      data.programingLanguage = ProgrammingLanguage.javascript

      jest
        .spyOn(testCaseRepo, 'save')
        .mockImplementation(async (data) =>
          createTestCaseEntityMock({ ...data, id: '2' } as TestCase)
        )

      const result = await testCaseService.createTestCase(data)

      expect(result).toEqual({
        id: '2',
        title: 'Test case 1',
        updatedAt: new Date('1-19-2022'),
        createdAt: new Date('1-19-2022'),
        generatedExpectResultScript: null,
        timeEvaluation: 30,
        expectResult: 'result',
        runningTestScript: 'script',
        programingLanguage: ProgrammingLanguage.javascript,
        codeChallenge: codeChallenge,
      })
    })
  })

  describe('updateTestCase', () => {
    const testCase = createTestCaseEntityMock()
    const codeChallenge = createCodeChallengeEntityMock()

    it('It should return testCase updated', async () => {
      data.generatedExpectResultScript = 'expect script'
      data.programingLanguage = ProgrammingLanguage.python

      jest.spyOn(testCaseService, 'findById').mockResolvedValue(testCase)
      jest
        .spyOn(codeChallengeServiceMock, 'findById')
        .mockResolvedValue(codeChallenge)

      jest
        .spyOn(testCaseRepo, 'save')
        .mockImplementation(async (data) =>
          createTestCaseEntityMock({ ...data } as TestCase)
        )

      const result = await testCaseService.updateTestCase('id', data)

      expect(result).toEqual({
        id: '1',
        title: 'Test case 1',
        updatedAt: new Date('1-19-2022'),
        createdAt: new Date('1-19-2022'),
        generatedExpectResultScript: 'expect script',
        timeEvaluation: 30,
        expectResult: '',
        runningTestScript: 'script',
        programingLanguage: ProgrammingLanguage.python,
        codeChallenge: codeChallenge,
      })
    })
  })
})
