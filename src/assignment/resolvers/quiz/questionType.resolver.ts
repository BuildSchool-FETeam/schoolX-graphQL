import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Question } from "src/assignment/entities/Question.entity";
import { QuestionService } from "src/assignment/services/question.service";

@Resolver()
export class QuestionTypeResolver {

    constructor(private questionService: QuestionService){}

    @ResolveField()
    async quiz(@Parent() parent: Question) {
        const question = await this.questionService.findById(parent.id, {relations: ["quiz"]});

        return question.quiz;
    }

    @ResolveField()
    async option(@Parent() parent: Question) {
        return parent.options.split("|");
    }
}