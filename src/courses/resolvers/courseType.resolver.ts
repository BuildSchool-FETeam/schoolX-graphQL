import { CourseService } from './../services/course.service';
import { CourseType } from './../../graphql';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

@Resolver('CourseType')
export class CourseTypeResolver {
  constructor(private courseService: CourseService) {}

  @ResolveField()
  async instructor(@Parent() courseParent: CourseType) {
    const course = await this.courseService.findById(courseParent.id, {
      relations: ['instructor'],
    });
    return course.instructor;
  }

  @ResolveField()
  async tags(@Parent() courseParent: CourseType) {
    const course = await this.courseService.findById(courseParent.id, {
      relations: ['tags'],
    });
    return course.tags;
  }
}
