import { Resolver, Query, ResolveField, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CourseService } from 'src/courses/services/course.service';
import { LessonService } from 'src/courses/services/lesson.service';
import { PaginationInput } from 'src/graphql';
import { Lesson } from 'src/courses/entities/Lesson.entity';
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator';

@UseGuards(AuthGuard)
@Resolver('LessonQuery')
export class LessonQueryResolver {
  constructor(
    private lessonService: LessonService,
    private courseService: CourseService,
  ) {}

  @Query()
  lessonQuery() {
    return {};
  }

  @ResolveField('lessonsWithCourseId')
  @PermissionRequire({ course: ['U'] })
  async getAllLessonsWithCourseId(
    @Args('courseId') courseId: string,
    @Args('pagination') pg: PaginationInput,
    @Context() { req }: any,
  ) {
    const token = this.lessonService.getTokenFromHttpHeader(req.headers);
    const paginationOptions = this.lessonService.buildPaginationOptions<Lesson>(
      pg,
    );
    const course = await this.courseService.findById(
      courseId,
      {},
      { token, strictResourceName: 'course' },
    );

    const lessons = await this.lessonService.findWithOptions({
      where: {
        course,
      },
      ...paginationOptions,
    });

    return lessons;
  }

  @PermissionRequire({ course: ['U'] })
  @ResolveField('lesson')
  async getLessonDetail(@Args('id') id: string) {
    const lesson = await this.lessonService.findById(id);

    return lesson;
  }
}
