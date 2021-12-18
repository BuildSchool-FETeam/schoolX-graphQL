import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentEvaluation } from "src/assignment/entities/fileAssignment/commentEvaluation.entity";
import { BaseService } from "src/common/services/base.service";
import { TokenService } from "src/common/services/token.service";
import { CommentEvaluationInput } from "src/graphql";
import { Repository } from "typeorm";

@Injectable()
export class CommentEvaluationService extends BaseService<CommentEvaluation>{
    constructor(
        @InjectRepository(CommentEvaluation)
        private commentEvaluaRepo: Repository<CommentEvaluation>,
        private tokenService: TokenService
    ){ super(commentEvaluaRepo) }

    async setComment(data: CommentEvaluationInput, token: string ) {

        if(!data.id){
            return this.create(data, token)
        }else {
            return await this.update(data, token)
        }
    }

    async create(data: CommentEvaluationInput, token: string) {
        const admin = await this.tokenService.getAdminUserByToken(token);
        const comment = this.commentEvaluaRepo.create({
            content: data.content,
            createdBy: admin
        })
        return this.commentEvaluaRepo.save(comment);
    }

    async update(data: CommentEvaluationInput, token: string) {
        const [admin, oldComment] = await Promise.all([
            this.tokenService.getAdminUserByToken(token),
            this.findById(data.id, {relations: ["createdBy"]})
        ])
        
        if(admin.id !== oldComment.createdBy.id) {
            throw new ForbiddenException("You don't have permission to perform this action")
        }

        oldComment.content = data.content;

        return this.commentEvaluaRepo.save(oldComment);
    }
}