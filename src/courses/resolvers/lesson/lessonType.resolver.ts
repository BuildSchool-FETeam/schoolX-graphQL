import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Lesson } from 'src/courses/entities/Lesson.entity';
import { LessonService } from 'src/courses/services/lesson.service';

@Resolver('LessonType')
export class LessonTypeResolver {
  constructor(private lessonService: LessonService) {}

  @ResolveField()
  async course(@Parent() lesson: Lesson) {
    const parent = await this.lessonService.findById(lesson.id, {
      relations: ['course'],
    });

    return parent.course;
  }

  @ResolveField()
  async documents(@Parent() lesson: Lesson) {
    const parent = await this.lessonService.findById(lesson.id, {
      relations: ['documents'],
    });

    return parent.documents;
  }

  @ResolveField()
  async assignments(@Parent() lesson: Lesson) {
    const parent = await this.lessonService.findById(lesson.id, {
      relations: ['assignments'],
    });

    return parent.assignments;
  }
}
