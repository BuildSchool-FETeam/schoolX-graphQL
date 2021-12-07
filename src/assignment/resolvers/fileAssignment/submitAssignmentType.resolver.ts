import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { SubmitAssignment } from "src/assignment/entities/fileAssignment/SubmitAssignment.entity";
import { SubmitAssignmentService } from "src/assignment/services/fileAssignment/submitAssignment.service";

@Resolver("SubmitAssignmentType")
export class SubmitAssignmentTypeResolver {
    constructor(
        private submitAssignService: SubmitAssignmentService
    ){}

    @ResolveField()
    async student(@Parent() submitAssignment: SubmitAssignment) {
        const data = await this.submitAssignService.findById(submitAssignment.id, {
            relations: ["student"]
        })

        return data.student;
    }

    @ResolveField()
    async comments(@Parent() submitAssignment: SubmitAssignment) {
        const data = await this.submitAssignService.findById(submitAssignment.id, {
            relations: ["comments"]
        })

        return data.comments;
    }
}