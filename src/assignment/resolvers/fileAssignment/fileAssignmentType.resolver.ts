import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { FileAssignment } from 'src/assignment/entities/fileAssignment/fileAssignment.entity';
import { FileAssignmentService } from 'src/assignment/services/fileAssignment/fileAssignment.service';
import { PaginationInput, SearchOptionInput } from 'src/graphql';

@Resolver('FileAssignmentType')
export class FileAssignmentTypeResolver {
  constructor(private fileAssignService: FileAssignmentService) {}

  @ResolveField()
  async assignment(@Parent() fileAssignment: FileAssignment) {
    const data = await this.fileAssignService.findById(fileAssignment.id, {
      relations: ['assignment'],
    });

    return data.assignment;
  }

  @ResolveField()
  async submittedGroupAssignments(
    @Parent() fileAssignment: FileAssignment,
    @Args('pagination') pagination?: PaginationInput,
    @Args('searchOpt') searchOpt?: SearchOptionInput,
  ) {
    const data = await this.fileAssignService.searchGroupAssign(
      fileAssignment.id,
      searchOpt,
    );
    return data
      ? this.fileAssignService.manuallyPagination(
          data.submittedGroupAssignments,
          pagination,
        )
      : [];
  }
}
