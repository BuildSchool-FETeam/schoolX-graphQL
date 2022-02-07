import { Test } from '@nestjs/testing'
import { Question } from 'src/assignment/entities/quiz/Question.entity'
import { QuestionService } from 'src/assignment/services/quiz/question.service'
import { baseServiceMock } from 'src/common/mock/baseServiceMock'
import {
  createQuestionEntityMock,
  createQuizEntityMock,
} from 'src/common/mock/mockEntity'
import { QuestionTypeResolver } from '../../quiz/questionType.resolver'

const questionServiceMock = {
  ...baseServiceMock,
}

describe('QuestionTypeResolver', () => {
  let resolver: QuestionTypeResolver
  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [QuestionService, QuestionTypeResolver],
    })
    setupTestModule
      .overrideProvider(QuestionService)
      .useValue(questionServiceMock)

    const compliedModule = await setupTestModule.compile()

    resolver = compliedModule.get(QuestionTypeResolver)
  })

  let parent: Question

  beforeEach(() => {
    parent = createQuestionEntityMock()
    jest.spyOn(questionServiceMock, 'findById').mockResolvedValue(parent)
  })

  describe('quiz', () => {
    it('It should return quiz', async () => {
      parent.quiz = createQuizEntityMock()

      const result = await resolver.quiz(parent)

      expect(result).toEqual(createQuizEntityMock())
    })
  })
})
