import {
  Injectable,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseService } from 'src/common/services/base.service'
import { Repository } from 'typeorm'
import * as _ from 'lodash'
import { ArticleService } from 'src/article/services/article.service'
import { Assignment } from 'src/assignment/entities/Assignment.entity'
import { SubmittedAssignmentService } from 'src/assignment/services/fileAssignment/submittedAssignment.service'
import { UserComment } from '../entities/UserComment.entity'
import { CourseService } from '../../courses/services/course.service'
import { CommentDataInput } from '../../graphql'
import { TokenService } from '../../common/services/token.service'
import { LessonService } from '../../courses/services/lesson.service'

interface IResourceAssign<T> {
  fieldAssign: keyof UserComment
  data: T
}

@Injectable()
export class UserCommentService extends BaseService<UserComment> {
  constructor(
    @InjectRepository(UserComment)
    private commentRepo: Repository<UserComment>,
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,
    private courseService: CourseService,
    @Inject(forwardRef(() => LessonService))
    private lessonService: LessonService,
    private articleService: ArticleService,
    private tokenService: TokenService,
    @Inject(forwardRef(() => SubmittedAssignmentService))
    private submittedAssignService: SubmittedAssignmentService
  ) {
    super(commentRepo, 'Comment')
  }

  async setCommentForCourse(
    courseId: string,
    data: CommentDataInput,
    token: string
  ) {
    const course = await this.courseService.findById(courseId)
    const comment = await this.setComment(
      data,
      { fieldAssign: 'course', data: course },
      token
    )

    return this.commentRepo.save(comment)
  }

  async setCommentForComment(
    commentId: string,
    data: CommentDataInput,
    token: string
  ) {
    const repliedComment = await this.findById(commentId)
    const newCommentReply = await this.setComment(
      data,
      { fieldAssign: 'replyTo', data: repliedComment },
      token
    )

    return this.commentRepo.save(newCommentReply)
  }

  async setCommentForLesson(
    lessonId: string,
    data: CommentDataInput,
    token: string
  ) {
    const lesson = await this.lessonService.findById(lessonId)
    const newCmt = await this.setComment(
      data,
      { fieldAssign: 'lesson', data: lesson },
      token
    )

    return this.commentRepo.save(newCmt)
  }

  async setCommentForAssignment(
    assignId: string,
    data: CommentDataInput,
    token: string
  ) {
    const assignment = await this.assignmentRepo.findOneBy({ id: assignId })
    const newComment = await this.setComment(
      data,
      { fieldAssign: 'assignment', data: assignment },
      token
    )

    return this.commentRepo.save(newComment)
  }

  async setCommentForArticle(
    articleId: string,
    data: CommentDataInput,
    token: string
  ) {
    const article = await this.articleService.findById(articleId)
    const newComment = await this.setComment(
      data,
      { fieldAssign: 'article', data: article },
      token
    )

    return this.commentRepo.save(newComment)
  }

  async setCommentForSubmittedAssign(
    submittedId: string,
    data: CommentDataInput,
    token: string
  ) {
    const submitted = await this.submittedAssignService.findById(submittedId)
    const newComment = await this.setComment(
      data,
      { fieldAssign: 'submittedAssignment', data: submitted },
      token
    )

    return this.commentRepo.save(newComment)
  }

  async deleteComment(id: string, token: string) {
    const user = await this.tokenService.getUserByToken(token)
    const existedComment = await this.findById(id, {
      relations: {
        reply: true,
        createdBy: true,
      },
      select: ['id'],
    })

    if (user.id !== existedComment.createdBy.id) {
      throw new ForbiddenException(
        "You don't have permission to perform this action"
      )
    }

    if (_.size(existedComment.reply) > 0) {
      await this.deleteRepliedComments(_.map(existedComment.reply, 'id'))
    }

    return this.deleteOneById(id)
  }

  private async deleteRepliedComments(ids: string[]) {
    const promises = _.map(ids, async (id) => this.deleteOneById(id))

    return Promise.all(promises)
  }

  private async setComment<T>(
    data: CommentDataInput,
    resourceAssign: IResourceAssign<T>,
    token: string
  ) {
    const user = await this.tokenService.getUserByToken(token)

    if (data.id) {
      const oldComment = await this.findById(data.id, {
        relations: { createdBy: true },
      })

      if (user.id !== oldComment.createdBy.id) {
        throw new ForbiddenException(
          "You don't have permission to perform this action"
        )
      }
      _.forOwn(data, (value, key) => {
        if (key !== 'id') {
          value && (oldComment[key] = value)
        }
      })

      return oldComment
    }

    return this.commentRepo.create({
      title: data.title,
      content: data.content,
      createdBy: user,
      [resourceAssign.fieldAssign]: resourceAssign.data,
    })
  }
}
