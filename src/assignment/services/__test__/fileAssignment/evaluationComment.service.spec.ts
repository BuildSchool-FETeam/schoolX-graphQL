import { ForbiddenException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { EvaluationComment } from 'src/assignment/entities/fileAssignment/evaluationComment.entity'
import { assertThrowError } from 'src/common/mock/customAssertion'
import {
  createAdminUserEntityMock,
  createEvaluationCommentEntityMock,
} from 'src/common/mock/mockEntity'
import { repositoryMockFactory } from 'src/common/mock/repositoryMock'
import { TokenService } from 'src/common/services/token.service'
import { EvaluationCommentInput } from 'src/graphql'
import { Repository } from 'typeorm'
import { EvaluationCommentService } from '../../fileAssignment/evaluationComment.service'

const tokenServiceMock = {
  async getUserByToken() {
    return Promise.resolve({})
  },
}

describe('EvaluationCommentService', () => {
  let evaluationCommentService: EvaluationCommentService
  let evaluationCommentRepo: Repository<EvaluationComment>
  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [
        EvaluationCommentService,
        TokenService,
        {
          provide: getRepositoryToken(EvaluationComment),
          useFactory: repositoryMockFactory,
        },
      ],
    })

    setupTestModule.overrideProvider(TokenService).useValue(tokenServiceMock)

    const compliedModule = await setupTestModule.compile()

    evaluationCommentRepo = compliedModule.get(
      getRepositoryToken(EvaluationComment)
    )
    evaluationCommentService = compliedModule.get(EvaluationCommentService)
  })

  describe('setComment', () => {
    let data: EvaluationCommentInput
    let getUserByToken
    beforeEach(() => {
      data = {
        content: 'content',
      }

      getUserByToken = jest
        .spyOn(tokenServiceMock, 'getUserByToken')
        .mockResolvedValue(createAdminUserEntityMock())
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('Create new comment', async () => {
      jest
        .spyOn(evaluationCommentRepo, 'save')
        .mockImplementation(async (data) =>
          createEvaluationCommentEntityMock(data as EvaluationComment)
        )

      const result = await evaluationCommentService.setComment(data, 'token')

      expect(result).toEqual(
        createEvaluationCommentEntityMock({
          content: data.content,
          createdBy: createAdminUserEntityMock(),
        })
      )
      expect(getUserByToken).toHaveBeenCalled()
    })

    describe('update old comment', () => {
      beforeEach(() => {
        data.id = '1'
      })

      it("If admin can't perform this action, it should throw Error", async () => {
        jest.spyOn(evaluationCommentService, 'findById').mockResolvedValue(
          createEvaluationCommentEntityMock({
            createdBy: createAdminUserEntityMock({ id: '2' }),
          })
        )

        assertThrowError(
          evaluationCommentService.setComment.bind(
            evaluationCommentService,
            data,
            'token'
          ),
          new ForbiddenException(
            "You don't have permission to perform this action"
          )
        )
      })

      it('It should update old comment', async () => {
        jest.spyOn(evaluationCommentService, 'findById').mockResolvedValue(
          createEvaluationCommentEntityMock({
            createdBy: createAdminUserEntityMock(),
          })
        )

        jest
          .spyOn(evaluationCommentRepo, 'save')
          .mockImplementation(async (data) =>
            createEvaluationCommentEntityMock(data as EvaluationComment)
          )

        const result = await evaluationCommentService.setComment(data, 'token')

        expect(result).toEqual(
          createEvaluationCommentEntityMock({
            content: 'content',
            createdBy: createAdminUserEntityMock(),
          })
        )
        expect(getUserByToken).toHaveBeenCalled()
      })
    })
  })
})
