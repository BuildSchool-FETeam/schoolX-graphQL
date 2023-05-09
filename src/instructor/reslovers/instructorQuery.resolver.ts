import { UseGuards } from '@nestjs/common'
import { Args, Context, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { PaginationInput } from 'src/graphql'
import { InstructorService } from '../services/instructor.service'
import { SearchOptionInput } from '../../graphql'

@UseGuards(AuthGuard)
@Resolver('InstructorQuery')
export class InstructorQueryResolver {
  constructor(private instructorService: InstructorService) {}

  @PermissionRequire({ instructor: ['C:x', 'R:*', 'U:x', 'D:x'] })
  @Query()
  instructorQuery() {
    return {}
  }

  @ResolveField('instructors')
  async getAllInstructors(
    @Args('pagination') pg: PaginationInput,
    @Args('searchOption') searchOpt: SearchOptionInput,
    @Context() { req }: DynamicObject
  ) {
    const token = this.instructorService.getTokenFromHttpHeader(req.headers)
    const pgOptions = this.instructorService.buildPaginationOptions(pg)
    const searchOptions = this.instructorService.buildSearchOptions(searchOpt)

    return this.instructorService.findWithOptions(
      { ...pgOptions, ...searchOptions },
      { token, strictResourceName: 'instructor' }
    )
  }

  @ResolveField('instructor')
  async getInstructorById(
    @Args('id') id: string,
    @Context() { req }: DynamicObject
  ) {
    const token = this.instructorService.getTokenFromHttpHeader(req.headers)

    return this.instructorService.findById(
      id,
      {},
      { token, strictResourceName: 'instructor' }
    )
  }

  @ResolveField()
  async totalInstructors(@Context() { req }: DynamicObject) {
    const token = this.instructorService.getTokenFromHttpHeader(req.headers)

    return this.instructorService.countingTotalItem({
      token,
      strictResourceName: 'instructor',
    })
  }
}
