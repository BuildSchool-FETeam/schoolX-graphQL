import { NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { json } from 'express'
import { Assignment } from 'src/assignment/entities/Assignment.entity'
import { CodeChallenge } from 'src/assignment/entities/codeChallenge/CodeChallenge.entity'
import { TestCaseProgrammingLanguage } from 'src/assignment/entities/codeChallenge/Testcase.entity'
import { assertThrowError } from 'src/common/mock/customAssertion'
import { createAssignmentEntityMock, createCodeChallengeEntityMock, createLessonEntityMock, createQuizEntityMock } from 'src/common/mock/mockEntity'
import { repositoryMockFactory } from 'src/common/mock/repositoryMock'
import { CourseService } from 'src/courses/services/course.service'
import { LessonService } from 'src/courses/services/lesson.service'
import { CodeChallengeSetInput, ProgrammingLanguage, QuizSetInput, TypeAssign } from 'src/graphql'
import { Repository } from 'typeorm'
import { AssignmentService } from '../assignment.service'
import { CodeChallengeService } from '../codeChallenge/codeChallenge.service'
import { FileAssignmentService } from '../fileAssignment/fileAssignment.service'
import { QuizService } from '../quiz/quiz.service'

const lessonServiceMock = {
  async findById() {
    return Promise.resolve({})
  }
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

  async delete() {} 
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
const fileAssignServiceMock = {}
const courseServiceMock = {}

describe('AssignmentService', () => {
  let assignmentService: AssignmentService
  let assignmentRepo: Repository<Assignment>
  let lessonService: LessonService
  let codeChallengeService: CodeChallengeService
  let quizService: QuizService
  let fileAssignService: FileAssignmentService
  let courseService: CourseService

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
    lessonService = compiledModule.get(LessonService)
    codeChallengeService = compiledModule.get(CodeChallengeService)
  })

  describe('getTypeAssign', () => {
    const assignment: Assignment = createAssignmentEntityMock()
    
    it("should return Type Assign or throw error when can't find assignment", async () => {
      let idAssign: string = '1'
      jest.spyOn(assignmentService, 'findById').mockResolvedValue(assignment)

      try {
        const result = await assignmentService.getTypeAssign('id', idAssign);
        expect(result).toEqual(TypeAssign);
      }catch{
        await assertThrowError(
          assignmentService.getTypeAssign.bind(assignmentService, 'id', idAssign),
          new NotFoundException(`Assignment with id ${idAssign} is not exist`)
        )
      }
    })
  })

  describe('createAssignment', () => {
    it('should create new assignment', async () => {
      const lesson = createLessonEntityMock({ id: "2"});
      jest.spyOn(lessonServiceMock, 'findById').mockResolvedValue(lesson);
      jest
        .spyOn(assignmentRepo, 'save')
        .mockImplementation(async (data) => 
          createAssignmentEntityMock({...data, id: "2"} as Assignment)
        );

      const result = await assignmentService.createAssignment('lessonId');
      const assignment = createAssignmentEntityMock({
        lesson, 
        id: "2"
      });

      expect(result).toEqual(assignment)
    })
  })

  describe('runCode', () => {
    const start = Date.now();
    it('should return success if code pass', async () => {
      const resultSuccess = {
        status: 'success',
        result: [],
        excutime: start - Date.now()
      }

      jest.spyOn(codeChallengeServiceMock, 'runCode').mockResolvedValue(resultSuccess);

      const result = await assignmentService.runCode("code", "language" as TestCaseProgrammingLanguage);

      expect(result).toEqual(resultSuccess);
    })

    it("should return error if code don't pass", async () => {
      const resultError = {
        status: 'error',
        result: [],
        excutime: start - Date.now()
      }

      jest.spyOn(codeChallengeServiceMock, 'runCode').mockResolvedValue(resultError)

      const result = await assignmentService.runCode("code", "language" as TestCaseProgrammingLanguage);

      expect(result).toEqual(resultError);
    })
  })

  describe('runTestCase', () => {
    it('should show summaryEvaluation true if all test case true', async () => {
      const expectResult = {
        summaryEvaluation: true,
        testCaseEvaluations: []
      }

      jest.spyOn(codeChallengeServiceMock, 'runTestCase').mockResolvedValue(expectResult);

      const result = await assignmentService.runTestCase('challengeId', {code: "code", language: "language" as ProgrammingLanguage});

      expect(result).toEqual(expectResult);
    })

    it('should show summaryEvaluation true if least one test case false', async () => {
      const expectResult = {
        summaryEvaluation: false,
        testCaseEvaluations: []
      }

      jest.spyOn(codeChallengeServiceMock, 'runTestCase').mockResolvedValue(expectResult);

      const result = await assignmentService.runTestCase('challengeId', {code: "code", language: "language" as ProgrammingLanguage});

      expect(result).toEqual(expectResult);
    })
  })

  describe('getCodeChallenge', () => {
    it('should return codeChallenge', async () => {
      const codeChallenge = createCodeChallengeEntityMock();

      jest.spyOn(codeChallengeServiceMock, 'findById').mockResolvedValue(codeChallenge);

      const result = await assignmentService.getCodeChallenge('id');

      expect(result).toEqual(codeChallenge);
    })
  })

  describe('setCodeChallenge', () => {
    const codeChallengeSetInput: CodeChallengeSetInput = {
      title: "Code Challenge 2",
      description: "here Code Challenge 2",
      lessonId: "1",
      input: "20",
      output: "400",
      hints: [],
      score: 200,
      languageSupport: ["javascript"]
    }
    it('should create new code challenge if id undefined', async () => {
      const codeChallenge = createCodeChallengeEntityMock(
        { 
          id: "id",
          title: "Code Challenge 2",
          description: "here Code Challenge 2",
          input: "20",
          output: "400",
          score: 200,
          languageSupport: "javascript"
        }
      );
      
      jest.spyOn(codeChallengeServiceMock, 'create').mockResolvedValue(codeChallenge);

      const result = await assignmentService.setCodeChallenge(undefined, codeChallengeSetInput)

      expect(result).toEqual(codeChallenge);
    })

    it('should update new code challenge if id exist', async () => {
      const codeChallenge = createCodeChallengeEntityMock(
        { 
          id: "id",
          title: "Code Challenge 2",
          description: "here Code Challenge 2",
          input: "20",
          output: "400",
          score: 200,
          languageSupport: "javascript"
        }
      );
      
      jest.spyOn(codeChallengeServiceMock, 'update').mockResolvedValue(codeChallenge);

      const result = await assignmentService.setCodeChallenge('id', codeChallengeSetInput)

      expect(result).toEqual(codeChallenge);
    })
  })

  describe('deleteCodeChallenge', () => {
    it('should return true if deleted', async () => {
      jest
        .spyOn(codeChallengeService, 'delete')
        .mockImplementation(async (id) => true)

      const result = await assignmentService.deleteCodeChallenge('id');

      expect(result).toEqual(true);
    })

    it('should return true if delete fail ', async () => {
      jest
        .spyOn(codeChallengeService, 'delete')
        .mockImplementation(async (id) => false)

      const result = await assignmentService.deleteCodeChallenge('id');

      expect(result).toEqual(false);
    })
  })

  describe('getQuiz', () => {
    it('should return quiz', async () => {
      const quiz = createQuizEntityMock();

      jest.spyOn(quizServiceMock, 'findById').mockResolvedValue(quiz);

      const result = await assignmentService.getQuiz("id");

      expect(result).toEqual(quiz);
    })
  })

  describe('setQuiz', () => {
    const quizSetInput: QuizSetInput = {
      title: "Quiz 2",
      description: "here Quiz 2",
      lessonId: "1",
      score: 200,
      questions: [],
      timeByMinute: 20
    }
    it('should create new code challenge if id undefined', async () => {
      const quiz = createQuizEntityMock(
        { 
          id: "id",
          title: "Code Challenge 2",
          description: "here Code Challenge 2",
          score: 200,
          timeByMinute: 20
        }
      );
      
      jest.spyOn(quizServiceMock, 'create').mockResolvedValue(quiz);

      const result = await assignmentService.setQuiz(undefined, quizSetInput)

      expect(result).toEqual(quiz);
    })

    it('should update new code challenge if id exist', async () => {
      const quiz = createQuizEntityMock(
        { 
          id: "id",
          title: "Code Challenge 2",
          description: "here Code Challenge 2",
          score: 200,
          timeByMinute: 20
        }
      );
      
      jest.spyOn(quizServiceMock, 'update').mockResolvedValue(quiz);

      const result = await assignmentService.setQuiz('id', quizSetInput)

      expect(result).toEqual(quiz);
    })
  })

})
