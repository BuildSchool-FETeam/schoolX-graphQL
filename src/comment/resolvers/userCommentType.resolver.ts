import { UserComment } from 'src/comment/entities/UserComment.entity';
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PaginationInput } from '../../graphql';
import { UserCommentService } from '../services/userComment.service';

@Resolver('UserCommentType')
export class UserCommentTypeResolver {
  constructor(private commentService: UserCommentService) {}

  @ResolveField()
  async createdBy(@Parent() comment: UserComment) {
    const data = await this.commentService.findById(comment.id, {
      select: ['id'],
      relations: ['createdBy'],
    });

    return data.createdBy;
  }

  @ResolveField()
  async course(@Parent() comment: UserComment) {
    const data = await this.commentService.findById(comment.id, {
      select: ['id'],
      relations: ['course'],
    });

    return data.course;
  }

  @ResolveField()
  async replyComments(
    @Parent() comment: UserComment,
    @Args('pagination') pg: PaginationInput,
  ) {
    const data = await this.commentService.findById(comment.id, {
      select: ['id'],
      relations: ['reply'],
    });

    return this.commentService.manuallyPagination(data.reply, pg);
  }

  @ResolveField()
  async assignment(@Parent() comment: UserComment) {
    const data = await this.commentService.findById(comment.id, {
      select: ['id'],
      relations: ['assignment'],
    });

    return data.assignment;
  }

  @ResolveField()
  async article(@Parent() comment: UserComment) {
    const data = await this.commentService.findById(comment.id, {
      select: ['id'],
      relations: ['article'],
    });

    return data.article;
  }

  @ResolveField()
  async submitted(@Parent() comment: UserComment) {
    const data = await this.commentService.findById(comment.id, {
      select: ['id'],
      relations: ['submittedAssignment'],
    });

    return data.submittedAssignment;
  }
}
