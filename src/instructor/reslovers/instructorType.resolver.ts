import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { InstructorType, PaginationInput } from 'src/graphql';
import { InstructorService } from '../services/instructor.service';
import * as _ from 'lodash';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';

@UseGuards(AuthGuard)
@Resolver('InstructorType')
export class InstructorTypeResolver {
  constructor(private instructorService: InstructorService) {}

  @ResolveField()
  async courses(
    @Parent() instructor: InstructorType,
    @Args('pagination') pg: PaginationInput,
  ) {
    const instructorWithCourses = await this.instructorService.findById(
      instructor.id,
      { relations: ['courses'] },
    );

    return this.instructorService.manuallyPagination(
      instructorWithCourses.courses,
      pg,
    );
  }

  @ResolveField()
  async createdBy(@Parent() instructor: InstructorType) {
    const instructorAndCreatedBy = await this.instructorService.findById(
      instructor.id,
      { relations: ['createdBy'] },
    );

    return instructorAndCreatedBy.createdBy;
  }
}
