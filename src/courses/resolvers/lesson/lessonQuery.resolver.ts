import { CourseService } from './../../services/course.service';
import { LessonService } from './../../services/lesson.service';
import { Resolver, Query, ResolveField, Args } from '@nestjs/graphql';

@Resolver('LessonQuery')
export class LessonQueryResolver {
  constructor(
    private lessonService: LessonService,
    private courseService: CourseService
  ) { }

  @Query()
  lessonQuery () {
    return {}
  }

  @ResolveField('lessonsWithCourseId')
  async getAllLessonsWithCourseId (@Args('courseId') courseId: string) {
    const course = await this.courseService.findById(courseId);

    return course.lessons;
  }

  @ResolveField('lesson')
  async getLessonDetail (@Args('id') id: string) {
    const lesson = await this.lessonService.findById(id);

    return lesson;
  }
}