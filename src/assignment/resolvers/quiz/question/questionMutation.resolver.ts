import { Args, Mutation, ResolveField, Resolver } from "@nestjs/graphql";
import { QuestionService } from "src/assignment/services/quiz/question.service";
import { QuestionSetInput } from "src/graphql";

@Resolver("QuestionMutation")
export class QuestionMutationResolver {

    constructor(
        private questionService: QuestionService
    ) {}

    @Mutation()
    questionMutation() {
        return {}
    }

    @ResolveField()
    setQuestion(
        @Args('id') id: string,
        @Args('data') data: QuestionSetInput
    ) {
        if(!id) {
            return this.questionService.create(data)
        }else {
            return this.questionService.update(id, data)
        }
    }

    @ResolveField()
    async deleteQuestion(
        @Args('id') id: string
    ) {
        
        return !!this.questionService.deleteOneById(id);
    }
}
