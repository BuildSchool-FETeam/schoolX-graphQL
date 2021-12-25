import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { SubmittedAssignment } from 'src/assignment/entities/fileAssignment/SubmittedAssignment.entity'
import { SubmittedAssignmentService } from 'src/assignment/services/fileAssignment/submittedAssignment.service'

@Resolver('SubmittedAssignmentType')
export class SubmittedAssignmentTypeResolver {
  constructor(private submitAssignService: SubmittedAssignmentService) {}

  @ResolveField()
  async comments(@Parent() submittedAssignment: SubmittedAssignment) {
    const data = await this.submitAssignService.findById(
      submittedAssignment.id,
      {
        relations: ['comments'],
      }
    )

    return data.comments
  }
}
