import { BadRequestException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Quiz } from 'src/assignment/entities/quiz/Quiz.entity'
import { baseServiceMock } from 'src/common/mock/baseServiceMock'
import { assertThrowError } from 'src/common/mock/customAssertion'
import {
  createAssignmentEntityMock,
  createLessonEntityMock,
  createQuestionEntityMock,
  createQuizEntityMock,
} from 'src/common/mock/mockEntity'
import { repositoryMockFactory } from 'src/common/mock/repositoryMock'
import { Lesson } from 'src/courses/entities/Lesson.entity'
import { LessonService } from 'src/courses/services/lesson.service'
import { QuizSetInput } from 'src/graphql'
import { Repository } from 'typeorm'
import { AssignmentService } from '../../assignment.service'
import { QuestionService } from '../../quiz/question.service'
import { QuizService } from '../../quiz/quiz.service'

const assignmentServiceMock = {
  ...baseServiceMock,
  async createAssignment() {
    return Promise.resolve({})
  },
  async deleteAssign() {
    return Promise.resolve({})
  },
}
const lessonServiceMock = {
  ...baseServiceMock,
}
const questionServiceMock = {
  async saveData() {
    return Promise.resolve({})
  },
  async delete() {
    return Promise.resolve({})
  },
}

describe('QuizServive', () => {
  let quizService: QuizService
  let quizRepo: Repository<Quiz>

  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [
        QuizService,
        AssignmentService,
        LessonService,
        QuestionService,
        {
          provide: getRepositoryToken(Quiz),
          useFactory: repositoryMockFactory,
        },
      ],
    })

    setupTestModule
      .overrideProvider(AssignmentService)
      .useValue(assignmentServiceMock)
    setupTestModule.overrideProvider(LessonService).useValue(lessonServiceMock)
    setupTestModule
      .overrideProvider(QuestionService)
      .useValue(questionServiceMock)

    const compliedModule = await setupTestModule.compile()

    quizService = compliedModule.get(QuizService)
    quizRepo = compliedModule.get(getRepositoryToken(Quiz))
  })

  describe('create', () => {
    let data: QuizSetInput
    let lesson: Lesson
    beforeEach(() => {
      data = {
        title: 'Quiz 1',
        lessonId: 'id',
        description: 'Description 1',
        questions: [
          {
            title: 'Question 1',
            options: ['a', 'b', 'c', 'd'],
            order: 1,
            isMultiple: false,
            result: 2,
          },
          {
            title: 'Question 2',
            options: ['a', 'b', 'c', 'd'],
            order: 2,
            isMultiple: true,
            results: [1, 3],
          },
        ],
        score: 100,
        timeByMinute: 10,
      }

      lesson = createLessonEntityMock()

      jest.spyOn(lessonServiceMock, 'findById').mockResolvedValue(lesson)
    })

    it("If assignment doesn't exist, it should create new assignment", async () => {
      lesson.assignment = null

      const createAssignment = jest
        .spyOn(assignmentServiceMock, 'createAssignment')
        .mockResolvedValue(createAssignmentEntityMock())

      const saveData = jest
        .spyOn(questionServiceMock, 'saveData')
        .mockResolvedValue([
          createQuestionEntityMock(data.questions[0]),
          createQuestionEntityMock(data.questions[1]),
        ])

      jest.spyOn(quizRepo, 'save').mockImplementation(async (data) =>
        createQuizEntityMock({
          questions: data.questions,
          assignment: data.assignment,
          title: data.title,
          description: data.description,
          score: data.score,
          timeByMinute: data.timeByMinute,
        } as Quiz)
      )

      const result = await quizService.create(data)

      expect(result).toEqual(
        createQuizEntityMock({
          questions: [
            createQuestionEntityMock(data.questions[0]),
            createQuestionEntityMock(data.questions[1]),
          ],
          assignment: createAssignmentEntityMock(),
          title: 'Quiz 1',
          description: 'Description 1',
          score: 100,
          timeByMinute: 10,
        })
      )
      expect(createAssignment).toHaveBeenCalled()
      expect(saveData).toHaveBeenCalled()
    })

    it('It should create new quiz without create assigment', async () => {
      const findAssign = jest
        .spyOn(assignmentServiceMock, 'findById')
        .mockResolvedValue(createAssignmentEntityMock())

      const saveData = jest
        .spyOn(questionServiceMock, 'saveData')
        .mockResolvedValue([
          createQuestionEntityMock(data.questions[0]),
          createQuestionEntityMock(data.questions[1]),
        ])

      jest.spyOn(quizRepo, 'save').mockImplementation(async (data) =>
        createQuizEntityMock({
          questions: data.questions,
          assignment: data.assignment,
          title: data.title,
          description: data.description,
          score: data.score,
          timeByMinute: data.timeByMinute,
        } as Quiz)
      )

      const result = await quizService.create(data)

      expect(result).toEqual(
        createQuizEntityMock({
          questions: [
            createQuestionEntityMock(data.questions[0]),
            createQuestionEntityMock(data.questions[1]),
          ],
          assignment: createAssignmentEntityMock(),
          title: 'Quiz 1',
          description: 'Description 1',
          score: 100,
          timeByMinute: 10,
        })
      )
      expect(findAssign).toHaveBeenCalled()
      expect(saveData).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    let data: QuizSetInput
    let lesson: Lesson
    beforeEach(() => {
      data = {
        title: 'Quiz 1',
        lessonId: 'id',
        description: 'Description 1',
        questions: [
          {
            title: 'Question 1',
            options: ['a', 'b', 'c', 'd'],
            order: 1,
            isMultiple: false,
            result: 2,
          },
          {
            title: 'Question 2',
            options: ['a', 'b', 'c', 'd'],
            order: 2,
            isMultiple: true,
            results: [1, 3],
          },
        ],
        score: 100,
        timeByMinute: 10,
      }

      lesson = createLessonEntityMock()

      jest.spyOn(lessonServiceMock, 'findById').mockResolvedValue(lesson)
      jest.spyOn(quizService, 'findById').mockResolvedValue(
        createQuizEntityMock({
          assignment: createAssignmentEntityMock({ id: '2' }),
        })
      )
    })

    it("If lesson doesn't contain quiz, it should throw new Error", async () => {
      lesson.assignment = createAssignmentEntityMock()

      assertThrowError(
        quizService.update.bind(quizService, 'id', data),
        new BadRequestException(
          `Lesson with id ${lesson.id} is not contain this quiz`
        )
      )
    })

    it('It should update quiz', async () => {
      lesson.assignment = createAssignmentEntityMock({ id: '2' })

      const saveData = jest
        .spyOn(questionServiceMock, 'saveData')
        .mockResolvedValue([
          createQuestionEntityMock(data.questions[0]),
          createQuestionEntityMock(data.questions[1]),
        ])
      const deleteQuestion = jest.spyOn(questionServiceMock, 'delete')

      jest
        .spyOn(quizRepo, 'save')
        .mockImplementation(async (data) => createQuizEntityMock(data as Quiz))

      const result = await quizService.update('id', data)

      expect(result).toEqual(
        createQuizEntityMock({
          assignment: createAssignmentEntityMock({ id: '2' }),
          questions: [
            createQuestionEntityMock(data.questions[0]),
            createQuestionEntityMock(data.questions[1]),
          ],
          title: 'Quiz 1',
          description: 'Description 1',
          score: 100,
          timeByMinute: 10,
        })
      )
      expect(saveData).toHaveBeenCalled()
      expect(deleteQuestion).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('It should delete quiz', async () => {
      jest.spyOn(quizService, 'findById').mockResolvedValue(
        createQuizEntityMock({
          assignment: createAssignmentEntityMock(),
        })
      )
      const deleteOneById = jest
        .spyOn(quizService, 'deleteOneById')
        .mockResolvedValue({ raw: null, affected: null })
      const deleteAssign = jest.spyOn(assignmentServiceMock, 'deleteAssign')

      const result = await quizService.delete('id')

      expect(result).toEqual(true)
      expect(deleteOneById).toHaveBeenCalled()
      expect(deleteAssign).toHaveBeenCalled()
    })
  })
})
