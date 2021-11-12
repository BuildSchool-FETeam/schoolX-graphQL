import { Args, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { QuestionService } from "src/assignment/services/quiz/question.service";

@Resolver("QuestionQuery")
export class QuestionQuery {

    constructor(
        private questionService: QuestionService
    ){}
    @Query()
    questionQuery() {
        return {}
    }

    @ResolveField()
    question(@Args('id') id: string) {
        return this.questionService.findById(id);
    }
}