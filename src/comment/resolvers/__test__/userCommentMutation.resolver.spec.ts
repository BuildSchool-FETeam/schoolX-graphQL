import { Test } from '@nestjs/testing'
import { UserCommentService } from 'src/comment/services/userComment.service'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { guardMock } from 'src/common/mock/guardMock'
import { createCommentEntityMock } from 'src/common/mock/mockEntity'
import { requestMock } from 'src/common/mock/requestObjectMock'
import { UserCommentMutationResolver } from '../userCommentMutation.resolver'

const userCommentServiceMock = {
  getTokenFromHttpHeader() {
    return ''
  },

  async setCommentForCourse() {
    return Promise.resolve(createCommentEntityMock())
  },

  async setCommentForLesson() {
    return Promise.resolve(createCommentEntityMock())
  },

  async setCommentForAssignment() {
    return Promise.resolve(createCommentEntityMock())
  },

  async setCommentForArticle() {
    return Promise.resolve(createCommentEntityMock())
  },

  async setCommentForComment() {
    return Promise.resolve(createCommentEntityMock())
  },

  async deleteComment() {
    return Promise.resolve({})
  },
}

describe('UserCommentMutationResolver', () => {
  let resolver: UserCommentMutationResolver
  const getTokenFromHttpHeader = jest
    .spyOn(userCommentServiceMock, 'getTokenFromHttpHeader')
    .mockReturnValue('token')
  const data = {
    id: '1',
    title: 'title',
    content: 'content',
  }

  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [UserCommentService, UserCommentMutationResolver],
    })

    setupTestModule
      .overrideProvider(UserCommentService)
      .useValue(userCommentServiceMock)
    setupTestModule.overrideGuard(AuthGuard).useValue(guardMock)

    const compliedModule = await setupTestModule.compile()

    resolver = compliedModule.get(UserCommentMutationResolver)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('userCommentMutation', () => {
    it('It should return empty object', () => {
      expect(resolver.userCommentMutation()).toEqual({})
    })
  })

  describe('setCommentToCourse', () => {
    it('It should return new comment for course', async () => {
      const result = await resolver.setCommentToCourse(
        'courseId',
        data,
        requestMock
      )

      expect(result).toEqual(createCommentEntityMock())
      expect(getTokenFromHttpHeader).toHaveBeenCalled()
    })
  })

  describe('setCommentToLesson', () => {
    it('It should return new comment for lesson', async () => {
      const result = await resolver.setCommentToLesson(
        'lessonId',
        data,
        requestMock
      )

      expect(result).toEqual(createCommentEntityMock())
      expect(getTokenFromHttpHeader).toHaveBeenCalled()
    })
  })

  describe('setCommentToAssignment', () => {
    it('It should return new comment for assignment', async () => {
      const result = await resolver.setCommentToAssignment(
        'assignmentId',
        data,
        requestMock
      )

      expect(result).toEqual(createCommentEntityMock())
      expect(getTokenFromHttpHeader).toHaveBeenCalled()
    })
  })

  describe('setCommentToArticle', () => {
    it('It should return new comment for article', async () => {
      const result = await resolver.setCommentToArticle(
        'articleId',
        data,
        requestMock
      )

      expect(result).toEqual(createCommentEntityMock())
      expect(getTokenFromHttpHeader).toHaveBeenCalled()
    })
  })

  describe('Delete comment', () => {
    it('It should return true', async () => {
      const deleteComment = jest.spyOn(userCommentServiceMock, 'deleteComment')

      const result = await resolver.deleteComment('commentId', requestMock)

      expect(result).toEqual(true)
      expect(getTokenFromHttpHeader).toHaveBeenCalled()
      expect(deleteComment).toHaveBeenCalled()
    })
  })

  describe('setReplyComment', () => {
    it('It should return reply comment ', async () => {
      const result = await resolver.setReplyComment(
        'commentId',
        data,
        requestMock
      )

      expect(result).toEqual(createCommentEntityMock())
      expect(getTokenFromHttpHeader).toHaveBeenCalled()
    })
  })
})
