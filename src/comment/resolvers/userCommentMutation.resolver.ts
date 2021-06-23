import { AuthGuard } from './../../common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { UserCommentService } from './../services/userComment.service';
import { Mutation, ResolveField, Resolver, Args, Context } from '@nestjs/graphql';
import { CommentDataInput } from 'src/graphql';
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator';

@UseGuards(AuthGuard)
@Resolver('UserCommentMutation')
export class UserCommentMutationResolver {
  constructor(
    private commentService: UserCommentService
  ) {}

  @Mutation()
  userCommentMutation() {
    return {}
  }

  @PermissionRequire({course: ['R']})
  @ResolveField()
  setCommentToCourse(
    @Args('courseId') courseId: string,
    @Args('data') data: CommentDataInput,
    @Context() {req}: any
  ) {
    const token = this.commentService.getTokenFromHttpHeader(req.headers);

    return this.commentService.setCommentForCourse(courseId, data, token)
  }

  @PermissionRequire({course: ['R']})
  @ResolveField()
  setCommentToLesson(
    @Args('lessonId') lessonId: string,
    @Args('data') data: CommentDataInput,
    @Context() {req}: any
  ) {
    const token = this.commentService.getTokenFromHttpHeader(req.headers);

    return this.commentService.setCommentForLesson(lessonId, data, token)
  }

  @ResolveField()
  setReplyComment(
    @Args('commentId') commentId: string,
    @Args('data') data: CommentDataInput,
    @Context() {req}: any
  ) {
    const token = this.commentService.getTokenFromHttpHeader(req.headers);

    return this.commentService.setCommentForComment(commentId, data, token)
  }
}