import { Test } from '@nestjs/testing'
import { SubmittedAssignment } from 'src/assignment/entities/fileAssignment/SubmittedAssignment.entity'
import { SubmittedAssignmentService } from 'src/assignment/services/fileAssignment/submittedAssignment.service'
import { baseServiceMock } from 'src/common/mock/baseServiceMock'
import {
  createEvaluationCommentEntityMock,
  createSubmittedEntityMock,
} from 'src/common/mock/mockEntity'
import { SubmittedAssignmentTypeResolver } from '../../fileAssignment/submittedAssignmentType.resolver'

const submittedAssignServiceMock = {
  ...baseServiceMock,
}

describe('SubmittedAssignmentTypeResolver', () => {
  let resolver: SubmittedAssignmentTypeResolver
  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [SubmittedAssignmentTypeResolver, SubmittedAssignmentService],
    })

    setupTestModule
      .overrideProvider(SubmittedAssignmentService)
      .useValue(submittedAssignServiceMock)

    const compliedModule = await setupTestModule.compile()

    resolver = compliedModule.get(SubmittedAssignmentTypeResolver)
  })
  let parent: SubmittedAssignment

  beforeEach(() => {
    parent = createSubmittedEntityMock()
  })

  describe('comments', () => {
    beforeEach(() => {
      parent.comments = [
        createEvaluationCommentEntityMock(),
        createEvaluationCommentEntityMock({ id: '2' }),
      ]
      jest
        .spyOn(submittedAssignServiceMock, 'findById')
        .mockResolvedValue(parent)
    })

    it('It should return comments', async () => {
      const result = await resolver.comments(parent)

      expect(result).toEqual([
        createEvaluationCommentEntityMock(),
        createEvaluationCommentEntityMock({ id: '2' }),
      ])
    })
  })
})
