import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluationComment } from 'src/assignment/entities/fileAssignment/evaluationComment.entity';
import { BaseService } from 'src/common/services/base.service';
import { TokenService } from 'src/common/services/token.service';
import { EvaluationCommentInput } from 'src/graphql';
import { Repository } from 'typeorm';

@Injectable()
export class EvaluationCommentService extends BaseService<EvaluationComment> {
  constructor(
    @InjectRepository(EvaluationComment)
    private commentEvaluaRepo: Repository<EvaluationComment>,
    private tokenService: TokenService,
  ) {
    super(commentEvaluaRepo);
  }

  async setComment(data: EvaluationCommentInput, token: string) {
    if (!data.id) {
      return this.create(data, token);
    }
    return await this.update(data, token);
  }

  private async create(data: EvaluationCommentInput, token: string) {
    const admin = await this.tokenService.getAdminUserByToken(token);
    const comment = this.commentEvaluaRepo.create({
      content: data.content,
      createdBy: admin,
    });
    return this.commentEvaluaRepo.save(comment);
  }

  private async update(data: EvaluationCommentInput, token: string) {
    const [admin, oldComment] = await Promise.all([
      this.tokenService.getAdminUserByToken(token),
      this.findById(data.id, { relations: ['createdBy'] }),
    ]);

    if (admin.id !== oldComment.createdBy.id) {
      throw new ForbiddenException(
        "You don't have permission to perform this action",
      );
    }

    oldComment.content = data.content;

    return this.commentEvaluaRepo.save(oldComment);
  }
}
