import { UseGuards } from '@nestjs/common';
import { Resolver, Query, ResolveField, Args } from '@nestjs/graphql';
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CourseService } from 'src/courses/services/course.service';

@UseGuards(AuthGuard)
@Resolver('CourseQuery')
export class CourseQueryResolver {
  constructor(private courseService: CourseService) {}

  @PermissionRequire({ course: ['R'] })
  @Query()
  courseQuery() {
    return {};
  }

  @ResolveField('courses')
  async getAllCourses() {
    const courses = await this.courseService.findWithOptions();

    return courses.map((course) => {
      return {
        ...course,
      };
    });
  }

  @ResolveField('course')
  async getCourseById(@Args('id') id: string) {
    const course = await this.courseService.findById(id);

    return {
      ...course,
    };
  }
}
