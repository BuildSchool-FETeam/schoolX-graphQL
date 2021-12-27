import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { Question } from 'src/assignment/entities/quiz/Question.entity'
import { QuestionService } from 'src/assignment/services/quiz/question.service'

@Resolver('QuestionType')
export class QuestionTypeResolver {
  constructor(private questionService: QuestionService) {}

  @ResolveField()
  async quiz(@Parent() parent: Question) {
    const question = await this.questionService.findById(parent.id, {
      relations: ['quiz'],
    })

    return question.quiz
  }
}
