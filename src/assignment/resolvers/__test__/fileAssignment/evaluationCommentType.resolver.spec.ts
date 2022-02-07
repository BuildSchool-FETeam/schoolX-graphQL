import { Test } from '@nestjs/testing'
import { EvaluationComment } from 'src/assignment/entities/fileAssignment/evaluationComment.entity'
import { EvaluationCommentService } from 'src/assignment/services/fileAssignment/evaluationComment.service'
import { baseServiceMock } from 'src/common/mock/baseServiceMock'
import {
  createAdminUserEntityMock,
  createEvaluationCommentEntityMock,
  createSubmittedEntityMock,
} from 'src/common/mock/mockEntity'
import { EvaluationCommentTypeResolver } from '../../fileAssignment/evaluationCommentType.resolver'

const evaluationCommentServiceMock = {
  ...baseServiceMock,
}

describe('SubmittedAssignmentTypeResolver', () => {
  let resolver: EvaluationCommentTypeResolver
  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [EvaluationCommentTypeResolver, EvaluationCommentService],
    })

    setupTestModule
      .overrideProvider(EvaluationCommentService)
      .useValue(evaluationCommentServiceMock)

    const compliedModule = await setupTestModule.compile()

    resolver = compliedModule.get(EvaluationCommentTypeResolver)
  })
  let parent: EvaluationComment

  beforeEach(() => {
    parent = createEvaluationCommentEntityMock()
  })

  describe('createBy', () => {
    beforeEach(() => {
      parent.createdBy = createAdminUserEntityMock()
      jest
        .spyOn(evaluationCommentServiceMock, 'findById')
        .mockResolvedValue(parent)
    })

    it('It should return comments', async () => {
      const result = await resolver.createdBy(parent)

      expect(result).toEqual(createAdminUserEntityMock())
    })
  })
})
