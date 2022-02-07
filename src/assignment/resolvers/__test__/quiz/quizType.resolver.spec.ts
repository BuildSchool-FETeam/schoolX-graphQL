import { Test } from '@nestjs/testing'
import { Quiz } from 'src/assignment/entities/quiz/Quiz.entity'
import { QuizService } from 'src/assignment/services/quiz/quiz.service'
import { baseServiceMock } from 'src/common/mock/baseServiceMock'
import {
  createAssignmentEntityMock,
  createQuestionEntityMock,
  createQuizEntityMock,
} from 'src/common/mock/mockEntity'
import { QuizTypeResolver } from '../../quiz/quizType.resolver'

const quizServiceMock = {
  ...baseServiceMock,
}

describe('QuizTypeResolver', () => {
  let resolver: QuizTypeResolver
  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [QuizTypeResolver, QuizService],
    })
    setupTestModule.overrideProvider(QuizService).useValue(quizServiceMock)

    const compliedModule = await setupTestModule.compile()

    resolver = compliedModule.get(QuizTypeResolver)
  })

  let parent: Quiz

  beforeEach(() => {
    parent = createQuizEntityMock()

    jest.spyOn(quizServiceMock, 'findById').mockResolvedValue(parent)
  })

  describe('assignment', () => {
    it('It should return assignment', async () => {
      parent.assignment = createAssignmentEntityMock()
      const result = await resolver.assignment(parent)

      expect(result).toEqual(createAssignmentEntityMock())
    })
  })

  describe('questions', () => {
    it('It should return questions', async () => {
      parent.questions = [
        createQuestionEntityMock(),
        createQuestionEntityMock({ id: '2' }),
      ]

      const result = await resolver.questions(parent)

      expect(result).toEqual([
        createQuestionEntityMock(),
        createQuestionEntityMock({ id: '2' }),
      ])
    })
  })
})
