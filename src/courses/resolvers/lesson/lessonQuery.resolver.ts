
import { Resolver, Query, ResolveField, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CourseService } from 'src/courses/services/course.service';
import { LessonService } from 'src/courses/services/lesson.service';

@UseGuards(AuthGuard)
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
    const course = await this.courseService.findById(courseId, { relations: ['lessons'] });

    return course.lessons;
  }

  @ResolveField('lesson')
  async getLessonDetail (@Args('id') id: string) {
    const lesson = await this.lessonService.findById(id);

    return lesson;
  }
}