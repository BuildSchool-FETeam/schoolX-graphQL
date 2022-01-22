import { Test } from '@nestjs/testing'
import { CodeChallenge } from 'src/assignment/entities/codeChallenge/CodeChallenge.entity'
import { CodeChallengeService } from 'src/assignment/services/codeChallenge/codeChallenge.service'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { baseServiceMock } from 'src/common/mock/baseServiceMock'
import { guardMock } from 'src/common/mock/guardMock'
import {
  createAssignmentEntityMock,
  createCodeChallengeEntityMock,
  createTestCaseEntityMock,
} from 'src/common/mock/mockEntity'
import { CodeChallengeTypeResolver } from '../../codeChallenge/codeChallengeType.resolver'

const codeChallengeServiceMock = {
  ...baseServiceMock,
}

describe('CodeChallengeTypeResolver', () => {
  let codeChallengeTypeResolver: CodeChallengeTypeResolver

  beforeAll(async () => {
    const testModule = Test.createTestingModule({
      providers: [CodeChallengeService, CodeChallengeTypeResolver],
    })

    testModule
      .overrideProvider(CodeChallengeService)
      .useValue(codeChallengeServiceMock)
    testModule.overrideGuard(AuthGuard).useValue(guardMock)

    const compiledModule = await testModule.compile()

    codeChallengeTypeResolver = compiledModule.get(CodeChallengeTypeResolver)
  })

  let codeChallenge: CodeChallenge

  beforeEach(() => {
    codeChallenge = createCodeChallengeEntityMock()

    jest
      .spyOn(codeChallengeServiceMock, 'findById')
      .mockResolvedValue(codeChallenge)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('assignment', () => {
    it('It should return assignment', async () => {
      codeChallenge.assignment = createAssignmentEntityMock()

      const result = await codeChallengeTypeResolver.assignment(codeChallenge)

      expect(result).toEqual(createAssignmentEntityMock())
    })
  })

  describe('testCases', () => {
    it('It should return testCases', async () => {
      codeChallenge.testCases = [
        createTestCaseEntityMock(),
        createTestCaseEntityMock({ id: '2' }),
        createTestCaseEntityMock({ id: '3' }),
      ]

      const result = await codeChallengeTypeResolver.testCases(codeChallenge)

      expect(result).toEqual([
        createTestCaseEntityMock(),
        createTestCaseEntityMock({ id: '2' }),
        createTestCaseEntityMock({ id: '3' }),
      ])
    })
  })

  describe('langagueSupport', () => {
    it('It should return languageSupport', async () => {
      codeChallenge.languageSupport = 'javascript|python|java'

      const result = await codeChallengeTypeResolver.languageSupport(
        codeChallenge
      )

      expect(result).toEqual(['javascript', 'python', 'java'])
    })
  })

  describe('hints', () => {
    it('It should return hinst', async () => {
      codeChallenge.hints = 'hint 1|hint 2|hint 3'

      const result = await codeChallengeTypeResolver.hints(codeChallenge)

      expect(result).toEqual(['hint 1', 'hint 2', 'hint 3'])
    })
  })
})
