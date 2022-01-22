import { BadRequestException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { CodeChallenge } from 'src/assignment/entities/codeChallenge/CodeChallenge.entity'
import { TestCaseProgrammingLanguage } from 'src/assignment/entities/codeChallenge/Testcase.entity'
import { assertThrowError } from 'src/common/mock/customAssertion'
import {
  createAssignmentEntityMock,
  createCodeChallengeEntityMock,
  createLessonEntityMock,
  createTestCaseEntityMock,
} from 'src/common/mock/mockEntity'
import { repositoryMockFactory } from 'src/common/mock/repositoryMock'
import { Lesson } from 'src/courses/entities/Lesson.entity'
import { LessonService } from 'src/courses/services/lesson.service'
import {
  CodeChallengeSetInput,
  CodeConfigInput,
  ProgrammingLanguage,
} from 'src/graphql'
import { JavaMiniServerService } from 'src/mini-server/services/JavaMiniServer.service'
import { JSMiniServerService } from 'src/mini-server/services/JSMiniServer.service'
import { PythonMiniServerService } from 'src/mini-server/services/PythonMiniServer.service'
import { Repository } from 'typeorm'
import { AssignmentService } from '../../assignment.service'
import { CodeChallengeService } from '../../codeChallenge/codeChallenge.service'

const GServiceMock = {
  async findById() {
    return Promise.resolve({})
  },
}
const lessonServiceMock = {
  ...GServiceMock,
}
const miniServiceMock = {
  async runCode() {
    return Promise.resolve({})
  },

  async runCodeWithTestCase() {
    return Promise.resolve({})
  },
}

const jsMiniServerServiceMock = { ...miniServiceMock }
const javaMiniServerServiceMock = { ...miniServiceMock }
const pythonMiniServerServiceMock = { ...miniServiceMock }

const assignmentServiceMock = {
  ...GServiceMock,
  async createAssignment() {
    return Promise.resolve({})
  },

  async deleteAssign() {
    return Promise.resolve({})
  },
}
describe('CodeChallengeService', () => {
  let codeChallengeRepo: Repository<CodeChallenge>
  let codeChallengeService: CodeChallengeService
  beforeAll(async () => {
    const testModule = Test.createTestingModule({
      providers: [
        CodeChallengeService,
        JSMiniServerService,
        JavaMiniServerService,
        PythonMiniServerService,
        AssignmentService,
        LessonService,
        {
          provide: getRepositoryToken(CodeChallenge),
          useFactory: repositoryMockFactory,
        },
      ],
    })

    testModule.overrideProvider(LessonService).useValue(lessonServiceMock)
    testModule
      .overrideProvider(AssignmentService)
      .useValue(assignmentServiceMock)
    testModule
      .overrideProvider(JSMiniServerService)
      .useValue(jsMiniServerServiceMock)
    testModule
      .overrideProvider(PythonMiniServerService)
      .useValue(pythonMiniServerServiceMock)
    testModule
      .overrideProvider(JavaMiniServerService)
      .useValue(javaMiniServerServiceMock)

    const compliedModule = await testModule.compile()

    codeChallengeService = compliedModule.get(CodeChallengeService)
    codeChallengeRepo = compliedModule.get(getRepositoryToken(CodeChallenge))
  })

  describe('create', () => {
    let lesson: Lesson

    const codeChallengeSetInput: CodeChallengeSetInput = {
      title: 'new Code Challenge',
      description: 'description',
      lessonId: 'lessonId',
      input: '10',
      output: '100',
      hints: [],
      score: 100,
      languageSupport: [],
    }

    const expectResult: CodeChallenge = {
      id: '2',
      assignment: createAssignmentEntityMock({
        id: '2',
        title: 'new Assignment',
      }),
      languageSupport: codeChallengeSetInput.languageSupport.join('|'),
      hints: codeChallengeSetInput.languageSupport.join('|'),
      title: codeChallengeSetInput.title,
      description: codeChallengeSetInput.description,
      input: codeChallengeSetInput.input,
      output: codeChallengeSetInput.output,
      score: codeChallengeSetInput.score,
      testCases: [],
      createdAt: new Date('1-18-2022'),
      updatedAt: new Date('1-18-2022'),
    }

    beforeEach(() => {
      lesson = createLessonEntityMock()
      jest.spyOn(lessonServiceMock, 'findById').mockResolvedValue(lesson)
    })

    it('If an assignment did not already exist, it should create one and then create a code challenge.', async () => {
      lesson.assignment = undefined

      const createAssignment = jest
        .spyOn(assignmentServiceMock, 'createAssignment')
        .mockResolvedValue(
          createAssignmentEntityMock({
            id: '2',
            title: 'new Assignment',
          })
        )

      jest.spyOn(codeChallengeRepo, 'save').mockImplementation(async (data) =>
        createCodeChallengeEntityMock({
          id: '2',
          languageSupport: data.languageSupport,
          hints: data.languageSupport,
          title: data.title,
          description: data.description,
          input: data.input,
          output: data.output,
          score: data.score,
          assignment: data.assignment,
        } as CodeChallenge)
      )

      const result = await codeChallengeService.create(codeChallengeSetInput)

      expect(result).toEqual(expectResult)
      expect(createAssignment).toHaveBeenCalledTimes(1)
    })

    it('If an assignment exists, it should create a code challenge.', async () => {
      const assignment = createAssignmentEntityMock({
        id: '2',
        title: 'new Assignment',
      })
      lesson.assignment = assignment

      const findAssignmentById = jest
        .spyOn(assignmentServiceMock, 'findById')
        .mockResolvedValue(assignment)

      jest.spyOn(codeChallengeRepo, 'save').mockImplementation(async (data) =>
        createCodeChallengeEntityMock({
          id: '2',
          languageSupport: data.languageSupport,
          hints: data.languageSupport,
          title: data.title,
          description: data.description,
          input: data.input,
          output: data.output,
          score: data.score,
          assignment: data.assignment,
        } as CodeChallenge)
      )
      const result = await codeChallengeService.create(codeChallengeSetInput)

      expect(result).toEqual(expectResult)
      expect(findAssignmentById).toHaveBeenCalledTimes(1)
    })
  })

  describe('update', () => {
    let lesson: Lesson
    let codeChallenge: CodeChallenge

    const codeChallengeSetInput: CodeChallengeSetInput = {
      title: 'new Code Challenge',
      description: 'description',
      lessonId: 'lessonId',
      input: '10',
      output: '100',
      hints: [],
      score: 100,
      languageSupport: [],
    }

    beforeEach(() => {
      lesson = createLessonEntityMock({
        id: '2',
        assignment: createAssignmentEntityMock(),
      })

      codeChallenge = createCodeChallengeEntityMock()
      jest.spyOn(lessonServiceMock, 'findById').mockResolvedValue(lesson)
    })
    it('If assignment did not contain a codeChallenge, it should throw an error.', async () => {
      codeChallenge.assignment = createAssignmentEntityMock({ id: '2' })
      jest
        .spyOn(codeChallengeService, 'findById')
        .mockResolvedValue(codeChallenge)

      assertThrowError(
        codeChallengeService.update.bind(
          codeChallengeService,
          'id',
          codeChallengeSetInput
        ),
        new BadRequestException(
          `Lesson with id ${lesson.id} is not contain this challenge`
        )
      )
    })

    it('It should update codeChallenge', async () => {
      codeChallenge.assignment = createAssignmentEntityMock()
      jest
        .spyOn(codeChallengeService, 'findById')
        .mockResolvedValue(codeChallenge)

      jest
        .spyOn(codeChallengeRepo, 'save')
        .mockImplementation(async (data) =>
          createCodeChallengeEntityMock({ ...data } as CodeChallenge)
        )

      const result = await codeChallengeService.update(
        'id',
        codeChallengeSetInput
      )

      const expectResult = {
        id: '2f8bdfa5-464a-4713-be3b-2937a3bb78d3',
        assignment: createAssignmentEntityMock(),
        title: codeChallengeSetInput.title,
        description: codeChallengeSetInput.description,
        input: codeChallengeSetInput.input,
        output: codeChallengeSetInput.output,
        hints: codeChallengeSetInput.hints.join('|'),
        score: codeChallengeSetInput.score,
        languageSupport: codeChallengeSetInput.languageSupport.join('|'),
        testCases: [],
        createdAt: new Date('1-18-2022'),
        updatedAt: new Date('1-18-2022'),
      }

      expect(result).toEqual(expectResult)
    })
  })

  describe('delete', () => {
    let codeChallenge: CodeChallenge

    beforeEach(() => {
      codeChallenge = createCodeChallengeEntityMock({
        assignment: createAssignmentEntityMock(),
      })
    })

    it('should remove codeChallenge', async () => {
      jest
        .spyOn(codeChallengeService, 'findById')
        .mockResolvedValue(codeChallenge)
      jest
        .spyOn(codeChallengeService, 'deleteOneById')
        .mockResolvedValue({ raw: {}, affected: 0 })
      const deleteAssign = jest.spyOn(assignmentServiceMock, 'deleteAssign')

      const result = await codeChallengeService.delete('id')

      expect(result).toEqual(true)
      expect(deleteAssign).toHaveBeenCalledTimes(1)
    })
  })

  describe('runCode', () => {
    describe('Should return mini service via language', () => {
      it('Should return JSMiniServerLanguage', async () => {
        const runCode = jest.spyOn(jsMiniServerServiceMock, 'runCode')

        await codeChallengeService.runCode(
          'code',
          TestCaseProgrammingLanguage.javascript
        )

        expect(runCode).toHaveBeenCalledTimes(1)
      })

      it('Should return JavaMiniServerLanguage', async () => {
        const runCode = jest.spyOn(javaMiniServerServiceMock, 'runCode')

        await codeChallengeService.runCode(
          'code',
          TestCaseProgrammingLanguage.java
        )

        expect(runCode).toHaveBeenCalledTimes(1)
      })

      it('Should return PythonMiniServerLanguage', async () => {
        const runCode = jest.spyOn(pythonMiniServerServiceMock, 'runCode')

        await codeChallengeService.runCode(
          'code',
          TestCaseProgrammingLanguage.python
        )

        expect(runCode).toHaveBeenCalledTimes(1)
      })
    })

    describe('Should return the result are "success" or "error', () => {
      it('If the code passed, it should return success.', async () => {
        jest.spyOn(jsMiniServerServiceMock, 'runCode').mockResolvedValue({
          status: 'success',
          result: [],
          executeTime: 0,
        })

        const result = await codeChallengeService.runCode(
          'code',
          TestCaseProgrammingLanguage.javascript
        )

        expect(result).toEqual({
          status: 'success',
          result: [],
          executeTime: 0,
        })
      })

      it("If the code didn't pass, it should return an error.", async () => {
        jest.spyOn(jsMiniServerServiceMock, 'runCode').mockResolvedValue({
          status: 'error',
          result: [],
          executeTime: 0,
        })

        const result = await codeChallengeService.runCode(
          'code',
          TestCaseProgrammingLanguage.javascript
        )

        expect(result).toEqual({
          status: 'error',
          result: [],
          executeTime: 0,
        })
      })
    })
  })

  describe('runTestCase', () => {
    const data: CodeConfigInput = {
      code: 'code',
      language: ProgrammingLanguage.javascript,
    }

    describe('Should return mini service via language', () => {
      const codeChallenge = createCodeChallengeEntityMock()

      beforeEach(() => {
        jest
          .spyOn(codeChallengeService, 'findById')
          .mockResolvedValue(codeChallenge)
      })
      afterEach(() => {
        jest.resetAllMocks()
      })
      it('Should return JSMiniServerLanguage', async () => {
        codeChallenge.testCases = [
          createTestCaseEntityMock({ expectResult: 'result' }),
          createTestCaseEntityMock({ id: '2', expectResult: 'result' }),
          createTestCaseEntityMock({ id: '3', expectResult: 'result' }),
        ]

        const runCode = jest
          .spyOn(jsMiniServerServiceMock, 'runCodeWithTestCase')
          .mockResolvedValue({
            status: 'success',
            result: ['result'],
            executeTime: 0,
          })

        await codeChallengeService.runTestCase('id', data)

        expect(runCode).toHaveBeenCalledTimes(3)
      })

      it('Should return JavaMiniServerLanguage', async () => {
        codeChallenge.testCases = [
          createTestCaseEntityMock({
            programingLanguage: ProgrammingLanguage.java,
            expectResult: 'result',
          }),
          createTestCaseEntityMock({
            id: '2',
            programingLanguage: ProgrammingLanguage.java,
            expectResult: 'result',
          }),
          createTestCaseEntityMock({
            id: '3',
            programingLanguage: ProgrammingLanguage.java,
            expectResult: 'result',
          }),
        ]

        const runCode = jest
          .spyOn(javaMiniServerServiceMock, 'runCodeWithTestCase')
          .mockResolvedValue({
            status: 'success',
            result: ['result'],
            executeTime: 0,
          })

        data.language = ProgrammingLanguage.java
        await codeChallengeService.runTestCase('id', data)

        expect(runCode).toHaveBeenCalledTimes(3)
      })

      it('Should return PythonMiniServerLanguage', async () => {
        codeChallenge.testCases = [
          createTestCaseEntityMock({
            programingLanguage: ProgrammingLanguage.python,
            expectResult: 'result',
          }),
          createTestCaseEntityMock({
            id: '2',
            programingLanguage: ProgrammingLanguage.python,
            expectResult: 'result',
          }),
          createTestCaseEntityMock({
            id: '3',
            programingLanguage: ProgrammingLanguage.python,
            expectResult: 'result',
          }),
        ]

        const runCode = jest
          .spyOn(pythonMiniServerServiceMock, 'runCodeWithTestCase')
          .mockResolvedValue({
            status: 'success',
            result: ['result'],
            executeTime: 0,
          })

        data.language = ProgrammingLanguage.python
        await codeChallengeService.runTestCase('id', data)

        expect(runCode).toHaveBeenCalledTimes(3)
      })

      it('If it return null, should throw error', async () => {
        data.language = null

        assertThrowError(
          codeChallengeService.runTestCase.bind(
            codeChallengeService,
            'id',
            data
          ),
          new BadRequestException('"data.language" doesn\'t exist')
        )
      })
    })

    describe('Running expect result', () => {
      const codeChallenge = createCodeChallengeEntityMock()
      beforeEach(() => {
        data.language = ProgrammingLanguage.javascript
        jest
          .spyOn(codeChallengeService, 'findById')
          .mockResolvedValue(codeChallenge)
        jest
          .spyOn(jsMiniServerServiceMock, 'runCodeWithTestCase')
          .mockResolvedValue({
            status: 'success',
            result: ['result'],
            executeTime: 0,
          })
      })
      it('Running by expect result', async () => {
        codeChallenge.testCases = [
          createTestCaseEntityMock({ expectResult: 'result' }),
          createTestCaseEntityMock({ id: '2', expectResult: 'result' }),
          createTestCaseEntityMock({ id: '3', expectResult: 'result' }),
        ]

        const result = await codeChallengeService.runTestCase('id', data)
        expect(result.testCaseEvaluations.length).toEqual(3)
      })

      it('Running by expect script', async () => {
        codeChallenge.testCases = [
          createTestCaseEntityMock({ generatedExpectResultScript: 'result' }),
          createTestCaseEntityMock({
            id: '2',
            generatedExpectResultScript: 'result',
          }),
          createTestCaseEntityMock({
            id: '3',
            generatedExpectResultScript: 'result',
          }),
        ]

        const runCode = jest
          .spyOn(jsMiniServerServiceMock, 'runCode')
          .mockResolvedValue({
            status: 'success',
            result: ['result'],
            executeTime: 0,
          })

        await codeChallengeService.runTestCase('id', data)

        expect(runCode).toHaveBeenCalledTimes(3)
      })
    })

    describe('Evaluate test case result', () => {
      const codeChallenge = createCodeChallengeEntityMock()
      let expectResult
      beforeEach(() => {
        jest
          .spyOn(codeChallengeService, 'findById')
          .mockResolvedValue(codeChallenge)
      })

      it('Have least one run script error, it return false', async () => {
        codeChallenge.testCases = [
          createTestCaseEntityMock({ expectResult: 'result' }),
          createTestCaseEntityMock({ id: '2', expectResult: 'result' }),
          createTestCaseEntityMock({ id: '3', expectResult: 'result' }),
        ]
        jest
          .spyOn(jsMiniServerServiceMock, 'runCodeWithTestCase')
          .mockResolvedValue({
            status: 'error',
            result: [],
            executeTime: 0,
          })

        const result = await codeChallengeService.runTestCase('id', data)

        expectResult = {
          summaryEvaluation: false,
          testCaseEvaluations: [
            {
              testResult: false,
              testCaseId: '1',
              title: 'TestCase',
              executeTime: 0,
              message: [],
            },
            {
              testResult: false,
              testCaseId: '2',
              title: 'TestCase',
              executeTime: 0,
              message: [],
            },
            {
              testResult: false,
              testCaseId: '3',
              title: 'TestCase',
              executeTime: 0,
              message: [],
            },
          ],
        }

        expect(result).toEqual(expectResult)
      })

      it('if have least one test result different expect result, it should return false', async () => {
        codeChallenge.testCases = [
          createTestCaseEntityMock({ expectResult: 'result' }),
          createTestCaseEntityMock({ id: '2', expectResult: 'result 1' }),
          createTestCaseEntityMock({ id: '3', expectResult: 'result' }),
        ]
        jest
          .spyOn(jsMiniServerServiceMock, 'runCodeWithTestCase')
          .mockResolvedValue({
            status: 'success',
            result: ['result'],
            executeTime: 0,
          })

        const result = await codeChallengeService.runTestCase('id', data)

        expectResult = {
          summaryEvaluation: false,
          testCaseEvaluations: [
            {
              testResult: true,
              testCaseId: '1',
              title: 'TestCase',
              executeTime: 0,
              message: [],
            },
            {
              testResult: false,
              testCaseId: '2',
              title: 'TestCase',
              executeTime: 0,
              message: ['Expect "result 1" but got "result"'],
            },
            {
              testResult: true,
              testCaseId: '3',
              title: 'TestCase',
              executeTime: 0,
              message: [],
            },
          ],
        }

        expect(result).toEqual(expectResult)
      })

      it('If have least one test case out executeTime, it should return false', async () => {
        codeChallenge.testCases = [
          createTestCaseEntityMock({
            expectResult: 'result',
            timeEvaluation: 40,
          }),
          createTestCaseEntityMock({
            id: '2',
            expectResult: 'result',
            timeEvaluation: 20,
          }),
          createTestCaseEntityMock({
            id: '3',
            expectResult: 'result',
            timeEvaluation: 40,
          }),
        ]
        jest
          .spyOn(jsMiniServerServiceMock, 'runCodeWithTestCase')
          .mockResolvedValue({
            status: 'success',
            result: ['result'],
            executeTime: 30,
          })

        const result = await codeChallengeService.runTestCase('id', data)

        expectResult = {
          summaryEvaluation: false,
          testCaseEvaluations: [
            {
              testResult: true,
              testCaseId: '1',
              title: 'TestCase',
              executeTime: 30,
              message: [],
            },
            {
              testResult: false,
              testCaseId: '2',
              title: 'TestCase',
              executeTime: 30,
              message: [
                `Expect the function run in 20 miliseconds
                    but yours runs in 30 miliseconds`,
              ],
            },
            {
              testResult: true,
              testCaseId: '3',
              title: 'TestCase',
              executeTime: 30,
              message: [],
            },
          ],
        }

        expect(result).toEqual(expectResult)
      })

      it("If test case doesn't exist expectResult, it should return false", async () => {
        codeChallenge.testCases = [
          createTestCaseEntityMock({ expectResult: 'result' }),
          createTestCaseEntityMock({ id: '2' }),
          createTestCaseEntityMock({ id: '3', expectResult: 'result' }),
        ]
        jest
          .spyOn(jsMiniServerServiceMock, 'runCodeWithTestCase')
          .mockResolvedValue({
            status: 'success',
            result: ['result'],
            executeTime: 0,
          })

        const result = await codeChallengeService.runTestCase('id', data)

        expectResult = {
          summaryEvaluation: false,
          testCaseEvaluations: [
            {
              testResult: true,
              testCaseId: '1',
              title: 'TestCase',
              executeTime: 0,
              message: [],
            },
            {
              testResult: false,
              testCaseId: '2',
              title: 'TestCase',
              executeTime: 0,
              message: ["this test case doesn't exist expected result"],
            },
            {
              testResult: true,
              testCaseId: '3',
              title: 'TestCase',
              executeTime: 0,
              message: [],
            },
          ],
        }

        expect(result).toEqual(expectResult)
      })
    })
  })
})
