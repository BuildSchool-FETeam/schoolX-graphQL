import { UserComment } from 'src/comment/entities/UserComment.entity';
import { UserCommentService } from './../services/userComment.service';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

@Resolver('UserCommentType')
export class UserCommentTypeResolver {
  constructor(
    private commentService: UserCommentService
  ) {}

  @ResolveField()
  async createdBy(@Parent() comment: UserComment) {
    const data = await this.commentService.findById(comment.id, {
      select: ['id'],
      relations: ['createdBy']
    })

    return data.createdBy
  }

  @ResolveField()
  async course(@Parent() comment: UserComment) {
    const data = await this.commentService.findById(comment.id, {
      select: ['id'],
      relations: ['course']
    })

    return data.course
  }

  @ResolveField()
  async replyComments(@Parent() comment: UserComment) {
    const data = await this.commentService.findById(comment.id, {
      select: ['id'],
      relations: ['reply']
    })

    return data.reply
  }
}
