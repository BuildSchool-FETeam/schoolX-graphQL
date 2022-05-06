import { Test } from '@nestjs/testing'
import { UserCommentService } from 'src/comment/services/userComment.service'
import {
  createArticleEntityMock,
  createAssignmentEntityMock,
  createClientUserEntityMock,
  createCommentEntityMock,
  createCourseEntityMock,
  createSubmittedEntityMock,
} from 'src/common/mock/mockEntity'
import { UserCommentTypeResolver } from '../userCommentType.resolver'

const userCommentServiceMock = {
  async findById() {
    return Promise.resolve({})
  },

  async manuallyPagination() {
    return Promise.resolve({})
  },
}

describe('UserCommentTypeResolver', () => {
  let resolver: UserCommentTypeResolver
  const comment = createCommentEntityMock()

  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [UserCommentTypeResolver, UserCommentService],
    })

    setupTestModule
      .overrideProvider(UserCommentService)
      .useValue(userCommentServiceMock)

    const compliedModule = await setupTestModule.compile()

    resolver = compliedModule.get(UserCommentTypeResolver)

    jest.spyOn(userCommentServiceMock, 'findById').mockResolvedValue(comment)
  })

  describe('createdBy', () => {
    it('It should return user create comment', async () => {
      comment.createdBy = createClientUserEntityMock()

      const result = await resolver.createdBy(comment)

      expect(result).toEqual(createClientUserEntityMock())
    })
  })

  describe('course', () => {
    it('It should return user create comment', async () => {
      comment.course = createCourseEntityMock()

      const result = await resolver.course(comment)

      expect(result).toEqual(createCourseEntityMock())
    })
  })

  describe('replyComments', () => {
    it('It should return reply comments', async () => {
      comment.reply = [
        createCommentEntityMock({ id: '1' }),
        createCommentEntityMock({ id: '2' }),
        createCommentEntityMock({ id: '3' }),
      ]

      const pagination = jest
        .spyOn(userCommentServiceMock, 'manuallyPagination')
        .mockResolvedValue([
          createCommentEntityMock({ id: '1' }),
          createCommentEntityMock({ id: '2' }),
          createCommentEntityMock({ id: '3' }),
        ])

      const result = await resolver.replyComments(comment, {})

      expect(result).toEqual([
        createCommentEntityMock({ id: '1' }),
        createCommentEntityMock({ id: '2' }),
        createCommentEntityMock({ id: '3' }),
      ])
      expect(pagination).toHaveBeenCalled()
    })
  })

  describe('assignment', () => {
    it('It should return assignment', async () => {
      comment.assignment = createAssignmentEntityMock()

      const result = await resolver.assignment(comment)

      expect(result).toEqual(createAssignmentEntityMock())
    })
  })

  describe('article', () => {
    it('It should return article', async () => {
      comment.article = createArticleEntityMock()

      const result = await resolver.article(comment)

      expect(result).toEqual(createArticleEntityMock())
    })
  })

  describe('submitted', () => {
    it('It should return submitted', async () => {
      comment.submittedAssignment = createSubmittedEntityMock()

      const result = await resolver.submitted(comment)

      expect(result).toEqual(createSubmittedEntityMock())
    })
  })
})
