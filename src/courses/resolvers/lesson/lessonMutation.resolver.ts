import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { Lesson } from 'src/courses/entities/Lesson.entity';
import { LessonService } from 'src/courses/services/lesson.service';
import { LessonSetInput } from 'src/graphql';

@Resolver('LessonMutation')
export class LessonMutationResolver {
  constructor(private lessonService: LessonService) {}

  @Mutation()
  lessonMutation() {
    return {};
  }

  @ResolveField()
  async setLesson(@Args('data') data: LessonSetInput, @Args('id') id?: string) {
    let lesson: Lesson;

    if (!id) {
      lesson = await this.lessonService.createLesson(data);
    } else {
      lesson = await this.lessonService.updateLesson(id, data);
    }

    return {
      ...lesson,
    };
  }

  async deleteLesson(@Args('id') id: string) {
    return this.lessonService.deleteOneById(id);
  }
}
