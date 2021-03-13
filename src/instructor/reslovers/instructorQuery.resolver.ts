import { InstructorService } from './../services/instructor.service';
import { Args, Query, ResolveField } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator';

@Resolver('InstructorQuery')
export class InstructorQueryResolver {
  constructor(private instructorService: InstructorService) {}

  @PermissionRequire({ instructor: ['R'] })
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
