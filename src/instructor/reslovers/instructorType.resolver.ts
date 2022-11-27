import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { InstructorType, PaginationInput } from 'src/graphql'
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { InstructorService } from '../services/instructor.service'

@UseGuards(AuthGuard)
@Resolver('InstructorType')
export class InstructorTypeResolver {
  constructor(private instructorService: InstructorService) {}

  @ResolveField()
  async courses(
    @Parent() instructor: InstructorType,
    @Args('pagination') pg: PaginationInput
  ) {
    const instructorWithCourses = await this.instructorService.findById(
      instructor.id,
      { relations: { courses: true } }
    )

    return this.instructorService.manuallyPagination(
      instructorWithCourses.courses,
      pg
    )
  }

  @ResolveField()
  async createdBy(@Parent() instructor: InstructorType) {
    const instructorAndCreatedBy = await this.instructorService.findById(
      instructor.id,
      { relations: { createdBy: true } }
    )

    return instructorAndCreatedBy.createdBy
  }
}
