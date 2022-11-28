import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { Quiz } from 'src/assignment/entities/quiz/Quiz.entity'
import { QuizService } from 'src/assignment/services/quiz/quiz.service'

@Resolver('QuizType')
export class QuizTypeResolver {
  constructor(private quizService: QuizService) {}

  @ResolveField()
  async assignment(@Parent() parent: Quiz) {
    const quiz = await this.quizService.findById(parent.id, {
      relations: { assignment: true },
    })

    return quiz.assignment
  }

  @ResolveField()
  async questions(@Parent() parent: Quiz) {
    const quiz = await this.quizService.findById(parent.id, {
      relations: { questions: true },
    })

    return quiz.questions
  }
}
