import { InstructorService } from './../services/instructor.service';
import { Args, Query, ResolveField } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';

@Resolver('InstructorQuery')
export class InstructorQueryResolver {
  constructor(private instructorService: InstructorService) {}

  @Query()
  instructorQuery() {
    return {};
  }

  @ResolveField()
  getAllInstructors() {
    return this.instructorService.findWithOptions();
  }

  @ResolveField()
  getInstructorById(@Args('id') id: string) {
    return this.instructorService.findById(id);
  }
}
