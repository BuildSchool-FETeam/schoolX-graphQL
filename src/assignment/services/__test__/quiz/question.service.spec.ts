/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Question } from 'src/assignment/entities/quiz/Question.entity'
import { assertThrowError } from 'src/common/mock/customAssertion'
import { createQuestionEntityMock } from 'src/common/mock/mockEntity'
import { repositoryMockFactory } from 'src/common/mock/repositoryMock'
import { QuestionSetInput } from 'src/graphql'
import { Repository } from 'typeorm'
import { QuestionService } from '../../quiz/question.service'

describe('QuestionService', () => {
  let questionRepo: Repository<Question>
  let questionService: QuestionService
  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [
        QuestionService,
        {
          provide: getRepositoryToken(Question),
          useFactory: repositoryMockFactory,
        },
      ],
    })

    const compliedModule = await setupTestModule.compile()

    questionRepo = compliedModule.get(getRepositoryToken(Question))
    questionService = compliedModule.get(QuestionService)
  })

  describe('saveData', () => {
    let data: QuestionSetInput[]

    beforeEach(() => {
      data = [
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
      ]
    })

    it('If question have 0 or 1 options, it should throw Error', async () => {
      data[0].options = []
      assertThrowError(
        questionService.saveData.bind(questionService, data),
        new BadRequestException(
          `Question ${data[0].title} must have least 2 options`
        )
      )
    })

    it('It should save question', async () => {
      const save = jest
        .spyOn(questionRepo, 'save')
        .mockResolvedValue([
          createQuestionEntityMock(data[0]),
          createQuestionEntityMock({ ...data[1], id: '2' }),
        ] as any)

      const result = await questionService.saveData(data)

      expect(result).toEqual([
        createQuestionEntityMock({
          title: 'Question 1',
          options: ['a', 'b', 'c', 'd'],
          order: 1,
          isMultiple: false,
          result: 2,
        }),
        createQuestionEntityMock({
          id: '2',
          title: 'Question 2',
          options: ['a', 'b', 'c', 'd'],
          order: 2,
          isMultiple: true,
          results: [1, 3],
        }),
      ])
      expect(save).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    let data: Question[]

    beforeEach(() => {
      data = [
        createQuestionEntityMock({
          title: 'Question 1',
          options: ['a', 'b', 'c', 'd'],
          order: 1,
          isMultiple: false,
          result: 2,
        }),
        createQuestionEntityMock({
          id: '2',
          title: 'Question 2',
          options: ['a', 'b', 'c', 'd'],
          order: 2,
          isMultiple: true,
          results: [1, 3],
        }),
      ]
    })
    it('It should delete questions', async () => {
      jest.spyOn(questionRepo, 'remove').mockResolvedValue(data as any)

      const result = await questionService.delete(data)

      expect(result).toEqual([
        createQuestionEntityMock({
          title: 'Question 1',
          options: ['a', 'b', 'c', 'd'],
          order: 1,
          isMultiple: false,
          result: 2,
        }),
        createQuestionEntityMock({
          id: '2',
          title: 'Question 2',
          options: ['a', 'b', 'c', 'd'],
          order: 2,
          isMultiple: true,
          results: [1, 3],
        }),
      ])
    })
  })
})
