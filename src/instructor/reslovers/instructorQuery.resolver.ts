import { SearchOptionInput } from './../../graphql';
import { UseGuards } from '@nestjs/common';
import { InstructorService } from './../services/instructor.service';
import { Args, Context, Query, ResolveField } from '@nestjs/graphql';
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
  async getAllInstructors(
    @Args('pagination') pg: PaginationInput,
    @Args('searchOption') searchOpt: SearchOptionInput,
    @Context() { req }: any,
  ) {
    const token = this.instructorService.getTokenFromHttpHeader(req.headers);
    const pgOptions = this.instructorService.buildPaginationOptions(pg);
    const searchOptions = this.instructorService.buildSearchOptions(searchOpt);

    return this.instructorService.findWithOptions(
      { ...pgOptions, ...searchOptions },
      { token, strictResourceName: 'instructor' },
    );
  }

  @ResolveField('instructor')
  getInstructorById(@Args('id') id: string, @Context() { req }: any) {
    const token = this.instructorService.getTokenFromHttpHeader(req.headers);

    return this.instructorService.findById(
      id,
      {},
      { token, strictResourceName: 'instructor' },
    );
  }
}
