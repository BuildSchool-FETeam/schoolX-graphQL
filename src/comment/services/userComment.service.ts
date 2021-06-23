import { LessonService } from './../../courses/services/lesson.service';
import { ClientUser } from 'src/clientUser/entities/ClientUser.entity';
import { TokenService } from './../../common/services/token.service';
import { CommentDataInput } from './../../graphql';
import { CourseService } from './../../courses/services/course.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { UserComment } from '../entities/UserComment.entity';
import * as _ from 'lodash'

interface IResourceAssign<T> {
  fieldAssign: keyof UserComment
  data: T
}

@Injectable()
export class UserCommentService extends BaseService<UserComment> {
  constructor(
    @InjectRepository(UserComment)
    private commentRepo: Repository<UserComment>,
    private courseService: CourseService,
    private lessonService: LessonService,
    private tokenService: TokenService
  ) {
    super(commentRepo, 'Comment');
  }

  async setCommentForCourse(courseId: string, data: CommentDataInput, token: string) {
    const course = await this.courseService.findById(courseId);
    const comment = await this.setComment(
      data, 
      {fieldAssign: 'course', data: course},
      token, 
    );
    
    return this.commentRepo.save(comment)
  }

  async setCommentForComment(commentId: string, data: CommentDataInput, token: string) {
    const repliedComment = await this.findById(commentId);
    const newCommentReply = await this.setComment(
      data,
      {fieldAssign: 'replyTo', data: repliedComment},
      token
    )

    return this.commentRepo.save(newCommentReply)
  }

  async setCommentForLesson(lessonId: string, data: CommentDataInput, token: string) {
    const lesson = await this.lessonService.findById(lessonId);
    const newCmt = await this.setComment(
      data,
      {fieldAssign: 'lesson', data: lesson},
      token
    )

    return this.commentRepo.save(newCmt)
  }

  private async setComment<T>(
    data: CommentDataInput, 
    resourceAssign: IResourceAssign<T>,
    token: string, 
  ) {
    const user = await this.tokenService.getAdminUserByToken<ClientUser>(token)

    if (data.id) {
      const oldComment = await this.findById(data.id);

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
      [resourceAssign.fieldAssign]: resourceAssign.data
    })
  }
}
