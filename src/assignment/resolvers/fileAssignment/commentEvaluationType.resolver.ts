import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { CommentEvaluation } from "src/assignment/entities/fileAssignment/commentEvaluation.entity";
import { CommentEvaluationService } from "src/assignment/services/fileAssignment/commentEvaluation.service";

@Resolver("CommentEvaluationType")
export class CommentEvaluationTypeResolver {
    constructor(private commentEvaluaService: CommentEvaluationService) {}

    @ResolveField()
    async createdBy(@Parent() commentEvalua: CommentEvaluation) {
        const parent = await this.commentEvaluaService.findById(commentEvalua.id,{
            relations: ["createdBy"]
        })

        return parent.createdBy;
    }
    
}