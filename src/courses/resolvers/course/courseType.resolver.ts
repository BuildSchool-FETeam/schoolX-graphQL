import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { Course } from 'src/courses/entities/Course.entity'
import { CourseService } from 'src/courses/services/course.service'
import { CourseType, PaginationInput } from 'src/graphql'

@Resolver('CourseType')
export class CourseTypeResolver {
  constructor(private courseService: CourseService) {}

  @ResolveField()
  async tags(@Parent() courseParent: CourseType) {
    const course = await this.courseService.findById(courseParent.id, {
      relations: { tags: true },
    })

    return course.tags
  }

  @ResolveField()
  async lessons(
    @Parent() courseParent,
    @Args('pagination') pg: PaginationInput
  ) {
    const course = await this.courseService.findById(courseParent.id, {
      relations: { lessons: true },
    })

    return this.courseService.manuallyPagination(course.lessons, pg)
  }

  @ResolveField()
  async createdBy(@Parent() courseParent: CourseType) {
    const course = await this.courseService.findById(courseParent.id, {
      relations: { createdBy: true },
    })

    return course.createdBy
  }

  @ResolveField()
  async benefits(@Parent() courseParent: Course) {
    return courseParent.benefits.split('|')
  }

  @ResolveField()
  async requirements(@Parent() courseParent: Course) {
    return courseParent.requirements.split('|')
  }

  @ResolveField()
  async levels(@Parent() courseParent: Course) {
    return courseParent.levels.split('|')
  }

  @ResolveField()
  async comments(
    @Parent() courseParent: Course,
    @Args('pagination') pg: PaginationInput
  ) {
    const course = await this.courseService.findById(courseParent.id, {
      select: ['id'],
      relations: { comments: true },
    })

    return this.courseService.manuallyPagination(course.comments, pg)
  }

  @ResolveField()
  async joinedUsers(@Parent() courseParent: Course) {
    const course = await this.courseService.findById(courseParent.id, {
      relations: { joinedUsers: true },
    })

    return course.joinedUsers
  }

  @ResolveField()
  async completedUser(
    @Parent() courseParent: Course,
    @Args('pagination') pg: PaginationInput
  ) {
    const course = await this.courseService.findById(courseParent.id, {
      relations: { completedUser: true },
    })

    return this.courseService.manuallyPagination(course.completedUser, pg)
  }
}
