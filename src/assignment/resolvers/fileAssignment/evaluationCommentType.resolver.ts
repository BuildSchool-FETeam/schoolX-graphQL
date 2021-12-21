import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { EvaluationComment } from 'src/assignment/entities/fileAssignment/evaluationComment.entity';
import { EvaluationCommentService } from 'src/assignment/services/fileAssignment/evaluationComment.service';

@Resolver('EvaluationCommentType')
export class EvaluationCommentTypeResolver {
  constructor(private commentEvaluaService: EvaluationCommentService) {}

  @ResolveField()
  async createdBy(@Parent() commentEvalua: EvaluationComment) {
    const parent = await this.commentEvaluaService.findById(commentEvalua.id, {
      relations: ['createdBy'],
    });

    return parent.createdBy;
  }
}
