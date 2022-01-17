import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Assignment } from 'src/assignment/entities/Assignment.entity'
import { TestCaseProgrammingLanguage } from 'src/assignment/entities/codeChallenge/Testcase.entity'
import { assertThrowError } from 'src/common/mock/customAssertion'
import {
  createAssignmentEntityMock,
  createCodeChallengeEntityMock,
  createCourseEntityMock,
  createEvaluationCommentEntityMock,
  createFileAssignmentEntityMock,
  createGroupAssignmentEntityMock,
  createLessonEntityMock,
  createQuizEntityMock,
  createSubmittedEntityMock,
  createClientUserEntityMock,
} from 'src/common/mock/mockEntity'
import { repositoryMockFactory } from 'src/common/mock/repositoryMock'
import { CourseService } from 'src/courses/services/course.service'
import { LessonService } from 'src/courses/services/lesson.service'
import {
  CodeChallengeSetInput,
  EvaluationInput,
  FileAssignmentSetInput,
  ProgrammingLanguage,
  QuizSetInput,
  SubmitInput,
  TypeAssign,
} from 'src/graphql'
import { Repository } from 'typeorm'
import { AssignmentService } from '../assignment.service'
import { CodeChallengeService } from '../codeChallenge/codeChallenge.service'
import { FileAssignmentService } from '../fileAssignment/fileAssignment.service'
import { QuizService } from '../quiz/quiz.service'

const lessonServiceMock = {
  async findById() {
    return Promise.resolve({})
  },
}
const codeChallengeServiceMock = {
  async runCode() {
    return Promise.resolve({})
  },

  async runTestCase() {
    return Promise.resolve({})
  },

  async findById() {
    return Promise.resolve({})
  },

  async create() {
    return Promise.resolve({})
  },

  async update() {
    return Promise.resolve({})
  },
}
const quizServiceMock = {
  async findById() {
    return Promise.resolve({})
  },

  async create() {
    return Promise.resolve({})
  },

  async update() {
    return Promise.resolve({})
  },
}
const fileAssignServiceMock = {
  async findById() {
    return Promise.resolve({})
  },

  async create() {
    return Promise.resolve({})
  },

  async update() {
    return Promise.resolve({})
  },

  async firstSubmit() {
    return Promise.resolve({})
  },

  async submit() {
    return Promise.resolve({})
  },

  async evaluation() {
    return Promise.resolve({})
  },

  async viewSubmittedAssign() {
    return Promise.resolve(true)
  },
}
const courseServiceMock = {
  async findById() {
    return Promise.resolve({})
  },
}

describe('AssignmentService', () => {
  let assignmentService: AssignmentService
  let assignmentRepo: Repository<Assignment>
  let codeChallengeService: CodeChallengeService
  let quizService: QuizService
  let fileAssignService: FileAssignmentService

  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [
        AssignmentService,
        LessonService,
        CodeChallengeService,
        QuizService,
        FileAssignmentService,
        CourseService,
        {
          provide: getRepositoryToken(Assignment),
          useFactory: repositoryMockFactory,
        },
      ],
    })

    setupTestModule.overrideProvider(LessonService).useValue(lessonServiceMock)
    setupTestModule
      .overrideProvider(CodeChallengeService)
      .useValue(codeChallengeServiceMock)
    setupTestModule.overrideProvider(QuizService).useValue(quizServiceMock)
    setupTestModule
      .overrideProvider(FileAssignmentService)
      .useValue(fileAssignServiceMock)
    setupTestModule.overrideProvider(CourseService).useValue(courseServiceMock)

    const compiledModule = await setupTestModule.compile()

    assignmentService = compiledModule.get(AssignmentService)
    assignmentRepo = compiledModule.get(getRepositoryToken(Assignment))
    codeChallengeService = compiledModule.get(CodeChallengeService)
    quizService = compiledModule.get(QuizService)
    fileAssignService = compiledModule.get(FileAssignmentService)
  })

  describe('getTypeAssign', () => {
    it('It should return Type Code Challenge if the ID is a code challenge', async () => {
      const assignment: Assignment = createAssignmentEntityMock({
        codeChallenges: [createCodeChallengeEntityMock()],
      })
      jest.spyOn(assignmentService, 'findById').mockResolvedValue(assignment)

      const result = await assignmentService.getTypeAssign(
        'id',
        '2f8bdfa5-464a-4713-be3b-2937a3bb78d3'
      )

      expect(result).toEqual(TypeAssign.codeChallenge)
    })

    it('It should return Type Quiz if the ID is a quiz', async () => {
      const assignment: Assignment = createAssignmentEntityMock({
        quizs: [createQuizEntityMock()],
      })
      jest.spyOn(assignmentService, 'findById').mockResolvedValue(assignment)

      const result = await assignmentService.getTypeAssign(
        'id',
        '2f8bdfa5-454a-4713-da3b-2937a3bb76d4'
      )

      expect(result).toEqual(TypeAssign.quiz)
    })

    it('It should return Type File Assignment if the ID is a file assignment', async () => {
      const assignment: Assignment = createAssignmentEntityMock({
        fileAssignments: [createFileAssignmentEntityMock()],
      })
      jest.spyOn(assignmentService, 'findById').mockResolvedValue(assignment)

      const result = await assignmentService.getTypeAssign(
        'id',
        '2f8bdfa5-454a-2304-cs5d-3456ac3dd78d4'
      )

      expect(result).toEqual(TypeAssign.fileAssignment)
    })

    it("It should throw an error if the assignment doesn't exist", async () => {
      const assignment: Assignment = createAssignmentEntityMock()
      jest.spyOn(assignmentService, 'findById').mockResolvedValue(assignment)
      const idAssign = '2'
      assertThrowError(
        assignmentService.getTypeAssign.bind(assignmentService, 'id', idAssign),
        new NotFoundException(`Assignment with id ${idAssign} is not exist`)
      )
    })
  })

  describe('createAssignment', () => {
    it('It should create a new assignment', async () => {
      const lesson = createLessonEntityMock({ id: '2' })
      jest.spyOn(lessonServiceMock, 'findById').mockResolvedValue(lesson)

      jest
        .spyOn(assignmentRepo, 'save')
        .mockImplementation(async (data) =>
          createAssignmentEntityMock({ ...data, id: '2' } as Assignment)
        )

      const result = await assignmentService.createAssignment('lessonId')
      const assignment = createAssignmentEntityMock({
        lesson,
        id: '2',
      })

      expect(result).toEqual(assignment)
    })
  })

  describe('runCode', () => {
    const start = Date.now()
    it('If the code passed, it should return success.', async () => {
      const resultSuccess = {
        status: 'success',
        result: [],
        excutime: start - Date.now(),
      }

      jest
        .spyOn(codeChallengeServiceMock, 'runCode')
        .mockResolvedValue(resultSuccess)

      const result = await assignmentService.runCode(
        'code',
        'language' as TestCaseProgrammingLanguage
      )

      expect(result).toEqual(resultSuccess)
    })

    it("If the code didn't pass, it should return an error.", async () => {
      const resultError = {
        status: 'error',
        result: [],
        excutime: start - Date.now(),
      }

      jest
        .spyOn(codeChallengeServiceMock, 'runCode')
        .mockResolvedValue(resultError)

      const result = await assignmentService.runCode(
        'code',
        'language' as TestCaseProgrammingLanguage
      )

      expect(result).toEqual(resultError)
    })
  })

  describe('runTestCase', () => {
    it('should show a summaryEvaluation: true if all test cases are true', async () => {
      const expectResult = {
        summaryEvaluation: true,
        testCaseEvaluations: [],
      }

      jest
        .spyOn(codeChallengeServiceMock, 'runTestCase')
        .mockResolvedValue(expectResult)

      const result = await assignmentService.runTestCase('challengeId', {
        code: 'code',
        language: 'language' as ProgrammingLanguage,
      })

      expect(result).toEqual(expectResult)
    })

    it('should show a summaryEvaluation: false if all test cases are false', async () => {
      const expectResult = {
        summaryEvaluation: false,
        testCaseEvaluations: [],
      }

      jest
        .spyOn(codeChallengeServiceMock, 'runTestCase')
        .mockResolvedValue(expectResult)

      const result = await assignmentService.runTestCase('challengeId', {
        code: 'code',
        language: 'language' as ProgrammingLanguage,
      })

      expect(result).toEqual(expectResult)
    })
  })

  describe('getCodeChallenge', () => {
    it('should return the codeChallenge', async () => {
      const codeChallenge = createCodeChallengeEntityMock()

      jest
        .spyOn(codeChallengeServiceMock, 'findById')
        .mockResolvedValue(codeChallenge)

      const result = await assignmentService.getCodeChallenge('id')

      expect(result).toEqual(codeChallenge)
    })
  })

  describe('setCodeChallenge', () => {
    const codeChallengeSetInput: CodeChallengeSetInput = {
      title: 'Code Challenge 2',
      description: 'here Code Challenge 2',
      lessonId: '1',
      input: '20',
      output: '400',
      hints: [],
      score: 200,
      languageSupport: ['javascript'],
    }
    it('If the id is undefined, a new code challenge should be created', async () => {
      const codeChallenge = createCodeChallengeEntityMock({
        id: 'id',
        title: 'Code Challenge 2',
        description: 'here Code Challenge 2',
        input: '20',
        output: '400',
        score: 200,
        languageSupport: 'javascript',
      })

      jest
        .spyOn(codeChallengeServiceMock, 'create')
        .mockResolvedValue(codeChallenge)

      const result = await assignmentService.setCodeChallenge(
        undefined,
        codeChallengeSetInput
      )

      expect(result).toEqual(codeChallenge)
    })

    it('It should update the code challenge if it exists.', async () => {
      const codeChallenge = createCodeChallengeEntityMock({
        id: 'id',
        title: 'Code Challenge 2',
        description: 'here Code Challenge 2',
        input: '20',
        output: '400',
        score: 200,
        languageSupport: 'javascript',
      })

      jest
        .spyOn(codeChallengeServiceMock, 'update')
        .mockResolvedValue(codeChallenge)

      const result = await assignmentService.setCodeChallenge(
        'id',
        codeChallengeSetInput
      )

      expect(result).toEqual(codeChallenge)
    })
  })

  describe('deleteCodeChallenge', () => {
    it('should return true if deleted', async () => {
      jest
        .spyOn(codeChallengeService, 'delete')
        .mockImplementation(async () => true)

      const result = await assignmentService.deleteCodeChallenge('id')

      expect(result).toEqual(true)
    })

    it('should return false if delete fails', async () => {
      jest
        .spyOn(codeChallengeService, 'delete')
        .mockImplementation(async () => false)

      const result = await assignmentService.deleteCodeChallenge('id')

      expect(result).toEqual(false)
    })
  })

  describe('getQuiz', () => {
    it('should return quiz', async () => {
      const quiz = createQuizEntityMock()

      jest.spyOn(quizServiceMock, 'findById').mockResolvedValue(quiz)

      const result = await assignmentService.getQuiz('id')

      expect(result).toEqual(quiz)
    })
  })

  describe('setQuiz', () => {
    const quizSetInput: QuizSetInput = {
      title: 'Quiz 2',
      description: 'here Quiz 2',
      lessonId: '1',
      score: 200,
      questions: [],
      timeByMinute: 20,
    }
    it('If the id is undefined, a new quiz should be created', async () => {
      const quiz = createQuizEntityMock({
        id: 'id',
        title: 'Code Challenge 2',
        description: 'here Code Challenge 2',
        score: 200,
        timeByMinute: 20,
      })

      jest.spyOn(quizServiceMock, 'create').mockResolvedValue(quiz)

      const result = await assignmentService.setQuiz(undefined, quizSetInput)

      expect(result).toEqual(quiz)
    })

    it('It should update the quiz if it exists', async () => {
      const quiz = createQuizEntityMock({
        id: 'id',
        title: 'Code Challenge 2',
        description: 'here Code Challenge 2',
        score: 200,
        timeByMinute: 20,
      })

      jest.spyOn(quizServiceMock, 'update').mockResolvedValue(quiz)

      const result = await assignmentService.setQuiz('id', quizSetInput)

      expect(result).toEqual(quiz)
    })
  })

  describe('deleteQuiz', () => {
    it('should return true if deleted', async () => {
      jest.spyOn(quizService, 'delete').mockImplementation(async () => true)

      const result = await assignmentService.deleteQuiz('id')

      expect(result).toEqual(true)
    })

    it('should return false if delete fails', async () => {
      jest.spyOn(quizService, 'delete').mockImplementation(async () => false)

      const result = await assignmentService.deleteQuiz('id')

      expect(result).toEqual(false)
    })
  })

  describe('getFileAssign', () => {
    it('should return file Assignment', async () => {
      const fileAssignment = createFileAssignmentEntityMock()

      jest
        .spyOn(fileAssignServiceMock, 'findById')
        .mockResolvedValue(fileAssignment)

      const result = await assignmentService.getFileAssign('id')

      expect(result).toEqual(fileAssignment)
    })
  })

  describe('setFileAssign', () => {
    const fileAssignSetInput: FileAssignmentSetInput = {
      title: 'file Assignment 2',
      description: 'here File Assignment 2',
      lessonId: '1',
      maxScore: 100,
      estimateTimeInMinute: 30,
    }
    it('if id is undefined, a new fileAssignment should be created', async () => {
      const fileAssign = createFileAssignmentEntityMock({
        title: 'file Assignment 2',
        description: 'here File Assignment 2',
        maxScore: 100,
        estimateTimeInMinute: 30,
      })

      jest.spyOn(fileAssignServiceMock, 'create').mockResolvedValue(fileAssign)

      const result = await assignmentService.setFileAssign(
        undefined,
        fileAssignSetInput
      )

      expect(result).toEqual(fileAssign)
    })

    it('It should update file Assginment if id exist', async () => {
      const fileAssign = createFileAssignmentEntityMock({
        id: 'id',
        title: 'file Assignment 2',
        description: 'here File Assignment 2',
        maxScore: 100,
        estimateTimeInMinute: 30,
      })

      jest.spyOn(fileAssignServiceMock, 'update').mockResolvedValue(fileAssign)

      const result = await assignmentService.setFileAssign(
        'id',
        fileAssignSetInput
      )

      expect(result).toEqual(fileAssign)
    })
  })

  describe('deleteFileAssign', () => {
    it('should return true if deleted', async () => {
      jest
        .spyOn(fileAssignService, 'delete')
        .mockImplementation(async () => true)

      const result = await assignmentService.deleteFileAssign('id')

      expect(result).toEqual(true)
    })

    it('should return false if delete fails', async () => {
      jest
        .spyOn(fileAssignService, 'delete')
        .mockImplementation(async () => false)

      const result = await assignmentService.deleteFileAssign('id')

      expect(result).toEqual(false)
    })
  })

  describe('submitAssignment', () => {
    const user = createClientUserEntityMock({ id: 'userId' })
    it('If the user does not join the course, it should throw an error', async () => {
      const course = createCourseEntityMock()
      const userId = 'userId'
      jest.spyOn(courseServiceMock, 'findById').mockResolvedValue(course)

      assertThrowError(
        assignmentService.submitAssignment.bind(
          assignmentService,
          'id',
          {} as SubmitInput,
          userId
        ),
        new BadRequestException(
          `User with id ${userId} doesn't join this course`
        )
      )
    })

    it('using firstSubmit if the group assignment is empty.', async () => {
      const course = createCourseEntityMock({
        joinedUsers: [user],
      })
      const groupAssignmemt = createGroupAssignmentEntityMock({
        user,
        submitteds: [
          createSubmittedEntityMock({ title: 'Submit Assign 1', group: this }),
        ],
      })
      jest.spyOn(courseServiceMock, 'findById').mockResolvedValue(course)
      jest
        .spyOn(fileAssignServiceMock, 'firstSubmit')
        .mockResolvedValue(groupAssignmemt)
      const result = await assignmentService.submitAssignment(
        'id',
        {
          title: 'Submit Assign 1',
          courseId: '1',
        } as SubmitInput,
        'userId'
      )

      expect(result).toEqual(groupAssignmemt)
    })

    it('If a group assignment exists, use submit.', async () => {
      const course = createCourseEntityMock({
        joinedUsers: [user],
      })
      const groupAssignmemt = createGroupAssignmentEntityMock({
        user,
        submitteds: [
          createSubmittedEntityMock({ title: 'Submit Assign 1', group: this }),
        ],
      })
      jest.spyOn(courseServiceMock, 'findById').mockResolvedValue(course)
      jest
        .spyOn(fileAssignServiceMock, 'submit')
        .mockResolvedValue(groupAssignmemt)
      const result = await assignmentService.submitAssignment(
        'id',
        {
          groupAssignmentId: 'id',
          title: 'Submit Assign 1',
          courseId: '1',
        } as SubmitInput,
        'userId'
      )

      expect(result).toEqual(groupAssignmemt)
    })
  })

  describe('evaluationAssignment', () => {
    const user = createClientUserEntityMock({ id: 'userId' })
    it('Executing Evaluation', async () => {
      const groupAssignment = createGroupAssignmentEntityMock({
        user,
        submitteds: [
          createSubmittedEntityMock({
            title: 'Submit Assign 1',
            group: this,
            comments: [createEvaluationCommentEntityMock()],
          }),
        ],
      })

      jest
        .spyOn(fileAssignServiceMock, 'evaluation')
        .mockResolvedValue(groupAssignment)

      const result = await assignmentService.evaluationAssignment(
        'id',
        {} as EvaluationInput,
        'token'
      )

      expect(result).toEqual(groupAssignment)
    })
  })

  describe('viewSubmittedAssign', () => {
    it('should return true', async () => {
      jest
        .spyOn(fileAssignServiceMock, 'viewSubmittedAssign')
        .mockResolvedValue(true)

      const result = await assignmentService.viewSubmittedAssign(
        'groupAssignId',
        1
      )

      expect(result).toEqual(true)
    })
  })

  describe('deleteAssign', () => {
    it('assignment is deleted.', async () => {
      const assignment = createAssignmentEntityMock()

      jest.spyOn(assignmentService, 'findById').mockResolvedValue(assignment)

      const deleted = jest
        .spyOn(assignmentService, 'deleteOneById')
        .mockResolvedValue({ raw: {}, affected: 0 })

      await assignmentService.deleteAssgin('id')
      expect(deleted).toHaveBeenCalledTimes(1)
    })

    it("assignment isn't deleted.", async () => {
      const assignment = createAssignmentEntityMock({
        codeChallenges: [createCodeChallengeEntityMock()],
      })

      jest.spyOn(assignmentService, 'findById').mockResolvedValue(assignment)

      await assignmentService.deleteAssgin('id')
    })
  })
})
