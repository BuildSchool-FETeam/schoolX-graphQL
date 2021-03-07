import { Resolver, Query, ResolveField, Args } from '@nestjs/graphql';
import { CourseService } from '../services/course.service';

@Resolver('CourseQuery')
export class CourseQueryResolver {
  constructor(private courseService: CourseService) {}

  @Query()
  courseQuery() {
    return {};
  }

  @ResolveField()
  async getAllCourses() {
    const courses = await this.courseService.findWithOptions();

    return courses.map((course) => {
      return {
        ...course,
        benefits: course.benefits.split('|'),
        requirements: course.requirements.split('|'),
      };
    });
  }

  @ResolveField()
  async getCourseById(@Args('id') id: string) {
    const course = await this.courseService.findById(id);

    return {
      ...course,
      benefits: course.benefits.split('|'),
      requirements: course.requirements.split('|'),
    };
  }
}
