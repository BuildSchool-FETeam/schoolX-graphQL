import { Resolver, Query, ResolveField, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CourseService } from 'src/courses/services/course.service';
import { LessonService } from 'src/courses/services/lesson.service';
import { PaginationInput, SearchOptionInput } from 'src/graphql';
import { Lesson } from 'src/courses/entities/Lesson.entity';
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator';
import * as _ from 'lodash'

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
    @Args('searchOption') searchOpt: SearchOptionInput,
    @Context() { req }: any,
  ) {
    const token = this.lessonService.getTokenFromHttpHeader(req.headers);
    const paginationOptions = this.lessonService.buildPaginationOptions<Lesson>(
      pg,
    );
    const searchOptions = this.lessonService.buildSearchOptions<Lesson>(searchOpt);
    const course = await this.courseService.findById(
      courseId,
      {},
      { token, strictResourceName: 'course' },
    );

    const lessonWhereOpts = _.map(searchOptions.where, (opt: DynamicObject) => {
      return {
        course,
        ...opt
      }
    })

    const lessons = await this.lessonService.findWithOptions({
      where: lessonWhereOpts,
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
