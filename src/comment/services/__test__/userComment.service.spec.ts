import { ForbiddenException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ArticleService } from 'src/article/services/article.service'
import { Assignment } from 'src/assignment/entities/Assignment.entity'
import { SubmittedAssignmentService } from 'src/assignment/services/fileAssignment/submittedAssignment.service'
import { ClientUser } from 'src/clientUser/entities/ClientUser.entity'
import { UserComment } from 'src/comment/entities/UserComment.entity'
import { assertThrowError } from 'src/common/mock/customAssertion'
import {
  createArticleEntityMock,
  createAssignmentEntityMock,
  createClientUserEntityMock,
  createCommentEntityMock,
  createCourseEntityMock,
  createLessonEntityMock,
  createSubmittedEntityMock,
} from 'src/common/mock/mockEntity'
import { repositoryMockFactory } from 'src/common/mock/repositoryMock'
import { TokenService } from 'src/common/services/token.service'
import { CourseService } from 'src/courses/services/course.service'
import { LessonService } from 'src/courses/services/lesson.service'
import { CommentDataInput } from 'src/graphql'
import { Repository } from 'typeorm'
import { UserCommentService } from '../userComment.service'

const courseServiceMock = {
  async findById() {
    return Promise.resolve({})
  },
}
const lessonServiceMock = {
  async findById() {
    return Promise.resolve({})
  },
}
const articleServiceMock = {
  async findById() {
    return Promise.resolve({})
  },
}
const tokenServiceMock = {
  async getUserByToken() {
    return Promise.resolve({})
  },
}
const submittedServiceMock = {
  async findById() {
    return Promise.resolve({})
  },
}

describe('UserCommentService', () => {
  let userCommentService: UserCommentService
  let userCommentRepo: Repository<UserComment>
  let assginmentRepo: Repository<Assignment>
  let courseService: CourseService
  let lessonService: LessonService
  let articleService: ArticleService
  let tokenService: TokenService
  let submittedAssignService: SubmittedAssignmentService

  beforeAll(async () => {
    const setupTestModule = Test.createTestingModule({
      providers: [
        UserCommentService,
        CourseService,
        LessonService,
        ArticleService,
        TokenService,
        SubmittedAssignmentService,
        {
          provide: getRepositoryToken(UserComment),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Assignment),
          useFactory: repositoryMockFactory,
        },
      ],
    })

    setupTestModule.overrideProvider(CourseService).useValue(courseServiceMock)
    setupTestModule.overrideProvider(LessonService).useValue(lessonServiceMock)
    setupTestModule
      .overrideProvider(ArticleService)
      .useValue(articleServiceMock)
    setupTestModule.overrideProvider(TokenService).useValue(tokenServiceMock)
    setupTestModule
      .overrideProvider(SubmittedAssignmentService)
      .useValue(submittedServiceMock)

    const compiledModule = await setupTestModule.compile()

    userCommentService = compiledModule.get(UserCommentService)
    userCommentRepo = compiledModule.get(getRepositoryToken(UserComment))
    assginmentRepo = compiledModule.get(getRepositoryToken(Assignment))
    courseService = compiledModule.get(CourseService)
    lessonService = compiledModule.get(LessonService)
    articleService = compiledModule.get(ArticleService)
    tokenService = compiledModule.get(TokenService)
    submittedAssignService = compiledModule.get(SubmittedAssignmentService)
  })

  describe('setCommentForCourse', () => {
    const user = createClientUserEntityMock()
    const course = createCourseEntityMock()
    const inputComment: CommentDataInput = {
      title: 'title',
      content: 'content',
    }

    beforeAll(() => {
      jest.spyOn(courseService, 'findById').mockResolvedValue(course)
      jest.spyOn(tokenService, 'getUserByToken').mockResolvedValue(user)
    })

    it(' should create new comment for course', async () => {
      jest
        .spyOn(userCommentRepo, 'save')
        .mockImplementation(async (data) =>
          createCommentEntityMock({ ...data } as UserComment)
        )

      const result = await userCommentService.setCommentForCourse(
        'courseId',
        inputComment,
        'token'
      )

      const expectResult = createCommentEntityMock({
        ...inputComment,
        course,
        createdBy: user,
      })

      expect(result).toEqual(expectResult)
    })

    describe('It should update comment', () => {
      let oldComment: UserComment

      beforeAll(() => {
        inputComment.id = '1'
      })

      it(' should throw exception forbidden', async () => {
        oldComment = createCommentEntityMock({
          ...inputComment,
          course,
          createdBy: createClientUserEntityMock({ id: '2' }),
        })

        jest.spyOn(userCommentService, 'findById').mockResolvedValue(oldComment)

        assertThrowError(
          userCommentService.setCommentForCourse.bind(
            userCommentService,
            'courseID',
            inputComment,
            'token'
          ),
          new ForbiddenException(
            "You don't have permission to perform this action"
          )
        )
      })

      it(' should update old comment', async () => {
        oldComment = createCommentEntityMock({
          ...inputComment,
          course,
          createdBy: user,
        })

        jest.spyOn(userCommentService, 'findById').mockResolvedValue(oldComment)

        const result = await userCommentService.setCommentForCourse(
          'courseId',
          inputComment,
          'token'
        )

        const expectResult = createCommentEntityMock({
          ...inputComment,
          course,
          createdBy: user,
        })

        jest
          .spyOn(userCommentRepo, 'save')
          .mockImplementation(async (data) =>
            createCommentEntityMock({ ...data } as UserComment)
          )

        expect(result).toEqual(expectResult)
      })
    })
  })

  describe('setCommentForComment', () => {
    const user = createClientUserEntityMock()
    const comment = createCommentEntityMock()
    const inputComment: CommentDataInput = {
      title: 'title',
      content: 'content',
    }

    beforeAll(() => {
      jest.spyOn(userCommentService, 'findById').mockResolvedValue(comment)
      jest.spyOn(tokenService, 'getUserByToken').mockResolvedValue(user)
    })

    it(' should create new reply comment for comment', async () => {
      jest
        .spyOn(userCommentRepo, 'save')
        .mockImplementation(async (data) =>
          createCommentEntityMock({ ...data } as UserComment)
        )

      const result = await userCommentService.setCommentForComment(
        'commentId',
        inputComment,
        'token'
      )

      const expectResult = createCommentEntityMock({
        ...inputComment,
        replyTo: comment,
        createdBy: user,
      })

      expect(result).toEqual(expectResult)
    })

    describe('It should update reply comment', () => {
      let oldComment: UserComment

      beforeAll(() => {
        inputComment.id = '1'
      })

      it(' should throw exception forbidden', async () => {
        oldComment = createCommentEntityMock({
          ...inputComment,
          replyTo: comment,
          createdBy: createClientUserEntityMock({ id: '2' }),
        })

        jest.spyOn(userCommentService, 'findById').mockResolvedValue(oldComment)

        assertThrowError(
          userCommentService.setCommentForComment.bind(
            userCommentService,
            'commentID',
            inputComment,
            'token'
          ),
          new ForbiddenException(
            "You don't have permission to perform this action"
          )
        )
      })

      it(' should update old comment', async () => {
        oldComment = createCommentEntityMock({
          ...inputComment,
          replyTo: comment,
          createdBy: user,
        })

        jest.spyOn(userCommentService, 'findById').mockResolvedValue(oldComment)

        const result = await userCommentService.setCommentForComment(
          'courseId',
          inputComment,
          'token'
        )

        const expectResult = createCommentEntityMock({
          ...inputComment,
          replyTo: comment,
          createdBy: user,
        })

        jest
          .spyOn(userCommentRepo, 'save')
          .mockImplementation(async (data) =>
            createCommentEntityMock({ ...data } as UserComment)
          )

        expect(result).toEqual(expectResult)
      })
    })
  })

  describe('setCommentForLesson', () => {
    const user = createClientUserEntityMock()
    const lesson = createLessonEntityMock()
    const inputComment: CommentDataInput = {
      title: 'title',
      content: 'content',
    }

    beforeAll(() => {
      jest.spyOn(lessonService, 'findById').mockResolvedValue(lesson)
      jest.spyOn(tokenService, 'getUserByToken').mockResolvedValue(user)
    })

    it(' should create new comment for lesson', async () => {
      jest
        .spyOn(userCommentRepo, 'save')
        .mockImplementation(async (data) =>
          createCommentEntityMock({ ...data } as UserComment)
        )

      const result = await userCommentService.setCommentForLesson(
        'lessonId',
        inputComment,
        'token'
      )

      const expectResult = createCommentEntityMock({
        ...inputComment,
        lesson,
        createdBy: user,
      })

      expect(result).toEqual(expectResult)
    })

    describe('It should update new comment', () => {
      let oldComment: UserComment

      beforeAll(() => {
        inputComment.id = '1'
      })

      it(' should throw exception forbidden', async () => {
        oldComment = createCommentEntityMock({
          ...inputComment,
          lesson,
          createdBy: createClientUserEntityMock({ id: '2' }),
        })

        jest.spyOn(userCommentService, 'findById').mockResolvedValue(oldComment)

        assertThrowError(
          userCommentService.setCommentForLesson.bind(
            userCommentService,
            'commentID',
            inputComment,
            'token'
          ),
          new ForbiddenException(
            "You don't have permission to perform this action"
          )
        )
      })

      it(' should update old comment', async () => {
        oldComment = createCommentEntityMock({
          ...inputComment,
          lesson,
          createdBy: user,
        })

        jest.spyOn(userCommentService, 'findById').mockResolvedValue(oldComment)

        const result = await userCommentService.setCommentForLesson(
          'courseId',
          inputComment,
          'token'
        )

        const expectResult = createCommentEntityMock({
          ...inputComment,
          lesson,
          createdBy: user,
        })

        jest
          .spyOn(userCommentRepo, 'save')
          .mockImplementation(async (data) =>
            createCommentEntityMock({ ...data } as UserComment)
          )

        expect(result).toEqual(expectResult)
      })
    })
  })

  describe('setCommentForAssignment', () => {
    const user = createClientUserEntityMock()
    const assignment = createAssignmentEntityMock()
    const inputComment: CommentDataInput = {
      title: 'title',
      content: 'content',
    }

    beforeAll(() => {
      jest.spyOn(assginmentRepo, 'findOne').mockResolvedValue(assignment)
      jest.spyOn(tokenService, 'getUserByToken').mockResolvedValue(user)
    })

    describe('It should update new comment', () => {
      let oldComment: UserComment

      beforeAll(() => {
        inputComment.id = '1'
      })

      it(' should throw exception forbidden', async () => {
        oldComment = createCommentEntityMock({
          ...inputComment,
          assignment,
          createdBy: createClientUserEntityMock({ id: '2' }),
        })

        jest.spyOn(userCommentService, 'findById').mockResolvedValue(oldComment)

        assertThrowError(
          userCommentService.setCommentForAssignment.bind(
            userCommentService,
            'assignmentID',
            inputComment,
            'token'
          ),
          new ForbiddenException(
            "You don't have permission to perform this action"
          )
        )
      })

      it(' should update old comment', async () => {
        oldComment = createCommentEntityMock({
          ...inputComment,
          assignment,
          createdBy: user,
        })

        jest.spyOn(userCommentService, 'findById').mockResolvedValue(oldComment)

        const result = await userCommentService.setCommentForAssignment(
          'assignmentId',
          inputComment,
          'token'
        )

        const expectResult = createCommentEntityMock({
          ...inputComment,
          assignment,
          createdBy: user,
        })

        jest
          .spyOn(userCommentRepo, 'save')
          .mockImplementation(async (data) =>
            createCommentEntityMock({ ...data } as UserComment)
          )

        expect(result).toEqual(expectResult)
      })
    })
  })

  describe('setCommentForArticle', () => {
    const user = createClientUserEntityMock()
    const article = createArticleEntityMock()
    const inputComment: CommentDataInput = {
      title: 'title',
      content: 'content',
    }

    beforeAll(() => {
      jest.spyOn(articleService, 'findById').mockResolvedValue(article)
      jest.spyOn(tokenService, 'getUserByToken').mockResolvedValue(user)
    })

    it(' should create new comment for article', async () => {
      jest
        .spyOn(userCommentRepo, 'save')
        .mockImplementation(async (data) =>
          createCommentEntityMock({ ...data } as UserComment)
        )

      const result = await userCommentService.setCommentForArticle(
        'articleId',
        inputComment,
        'token'
      )

      const expectResult = createCommentEntityMock({
        ...inputComment,
        article,
        createdBy: user,
      })

      expect(result).toEqual(expectResult)
    })

    describe('It should update comment', () => {
      let oldComment: UserComment

      beforeAll(() => {
        inputComment.id = '1'
      })

      it(' should throw exception forbidden', async () => {
        oldComment = createCommentEntityMock({
          ...inputComment,
          article,
          createdBy: createClientUserEntityMock({ id: '2' }),
        })

        jest.spyOn(userCommentService, 'findById').mockResolvedValue(oldComment)

        assertThrowError(
          userCommentService.setCommentForArticle.bind(
            userCommentService,
            'articleID',
            inputComment,
            'token'
          ),
          new ForbiddenException(
            "You don't have permission to perform this action"
          )
        )
      })

      it(' should update old comment', async () => {
        oldComment = createCommentEntityMock({
          ...inputComment,
          article,
          createdBy: user,
        })

        jest.spyOn(userCommentService, 'findById').mockResolvedValue(oldComment)

        const result = await userCommentService.setCommentForArticle(
          'courseId',
          inputComment,
          'token'
        )

        const expectResult = createCommentEntityMock({
          ...inputComment,
          article,
          createdBy: user,
        })

        jest
          .spyOn(userCommentRepo, 'save')
          .mockImplementation(async (data) =>
            createCommentEntityMock({ ...data } as UserComment)
          )

        expect(result).toEqual(expectResult)
      })
    })
  })

  describe('setCommentForSubmittedAssignment', () => {
    const user = createClientUserEntityMock()
    const submitted = createSubmittedEntityMock()
    const inputComment: CommentDataInput = {
      title: 'title',
      content: 'content',
    }

    beforeAll(() => {
      jest
        .spyOn(submittedAssignService, 'findById')
        .mockResolvedValue(submitted)
      jest.spyOn(tokenService, 'getUserByToken').mockResolvedValue(user)
    })

    it(' should create new comment for submitted assignment', async () => {
      jest
        .spyOn(userCommentRepo, 'save')
        .mockImplementation(async (data) =>
          createCommentEntityMock({ ...data } as UserComment)
        )

      const result = await userCommentService.setCommentForSubmittedAssign(
        'lessonId',
        inputComment,
        'token'
      )

      const expectResult = createCommentEntityMock({
        ...inputComment,
        submittedAssignment: submitted,
        createdBy: user,
      })

      expect(result).toEqual(expectResult)
    })

    describe('It should update comment', () => {
      let oldComment: UserComment

      beforeAll(() => {
        inputComment.id = '1'
      })

      it(' should throw exception forbidden', async () => {
        oldComment = createCommentEntityMock({
          ...inputComment,
          submittedAssignment: submitted,
          createdBy: createClientUserEntityMock({ id: '2' }),
        })

        jest.spyOn(userCommentService, 'findById').mockResolvedValue(oldComment)

        assertThrowError(
          userCommentService.setCommentForSubmittedAssign.bind(
            userCommentService,
            'commentID',
            inputComment,
            'token'
          ),
          new ForbiddenException(
            "You don't have permission to perform this action"
          )
        )
      })

      it(' should update old comment', async () => {
        oldComment = createCommentEntityMock({
          ...inputComment,
          submittedAssignment: submitted,
          createdBy: user,
        })

        jest.spyOn(userCommentService, 'findById').mockResolvedValue(oldComment)

        const result = await userCommentService.setCommentForSubmittedAssign(
          'courseId',
          inputComment,
          'token'
        )

        const expectResult = createCommentEntityMock({
          ...inputComment,
          submittedAssignment: submitted,
          createdBy: user,
        })

        jest
          .spyOn(userCommentRepo, 'save')
          .mockImplementation(async (data) =>
            createCommentEntityMock({ ...data } as UserComment)
          )

        expect(result).toEqual(expectResult)
      })
    })
  })

  describe('deleteComment', () => {
    let user: ClientUser
    const existedComment = createCommentEntityMock({
      id: '1',
      createdBy: createClientUserEntityMock({ id: '1' }),
    })

    beforeAll(() => {
      jest
        .spyOn(userCommentService, 'findById')
        .mockResolvedValue(existedComment)
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it(' should throw exception forbidden', async () => {
      user = createClientUserEntityMock({ id: '2' })

      jest.spyOn(tokenService, 'getUserByToken').mockResolvedValue(user)

      assertThrowError(
        userCommentService.deleteComment.bind(
          userCommentService,
          'id',
          'token'
        ),
        new ForbiddenException(
          "You don't have permission to perform this action"
        )
      )
    })

    describe('It should delete comment', () => {
      let deleteOneById
      beforeAll(() => {
        user = createClientUserEntityMock({ id: '1' })
        jest.spyOn(tokenService, 'getUserByToken').mockResolvedValue(user)
        deleteOneById = jest
          .spyOn(userCommentService, 'deleteOneById')
          .mockResolvedValue({
            affected: 1,
            raw: null,
          })
      })

      it(' without delete reply comment', async () => {
        const result = await userCommentService.deleteComment('id', 'token')

        expect({ affected: 1, raw: null }).toEqual(result)
        expect(deleteOneById).toHaveBeenCalledTimes(1)
      })

      it(' delete reply comment', async () => {
        existedComment.reply = [
          createCommentEntityMock({ id: '2' }),
          createCommentEntityMock({ id: '3' }),
        ]

        const result = await userCommentService.deleteComment('id', 'token')

        expect({ affected: 1, raw: null }).toEqual(result)
        expect(deleteOneById).toHaveBeenCalledTimes(
          existedComment.reply.length + 1
        )
      })
    })
  })
})
