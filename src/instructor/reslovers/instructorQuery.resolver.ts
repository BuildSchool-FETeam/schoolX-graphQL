import { UseGuards } from '@nestjs/common';
import { InstructorService } from './../services/instructor.service';
import { Args, Query, ResolveField } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { PaginationInput } from 'src/graphql';

@UseGuards(AuthGuard)
@Resolver('InstructorQuery')
export class InstructorQueryResolver {
  constructor(private instructorService: InstructorService) {}

  @PermissionRequire({ instructor: ['R'] })
  @Query()
  instructorQuery() {
    return {};
  }

  @ResolveField('instructors')
  async getAllInstructors(@Args('pagination') pg: PaginationInput) {
    const pgOptions = this.instructorService.buildPaginationOptions(pg);
    return this.instructorService.findWithOptions({ ...pgOptions });
  }

  @ResolveField('instructor')
  getInstructorById(@Args('id') id: string) {
    return this.instructorService.findById(id);
  }
}
