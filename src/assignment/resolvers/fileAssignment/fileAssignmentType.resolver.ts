import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { FileAssignment } from "src/assignment/entities/fileAssignment/fileAssignment.entity";
import { FileAssignmentService } from "src/assignment/services/fileAssignment/fileAssignment.service";

@Resolver("FileAssignmentType")
export class FileAssignmentTypeResolver {
    constructor(private fileAssignService: FileAssignmentService) {
        
    }

    @ResolveField()
    async students(@Parent() fileAssignment: FileAssignment){
        const data = await this.fileAssignService.findById(fileAssignment.id, {
            relations: ["students"]
        })

        return data.students;
    }

    @ResolveField()
    async assignment(@Parent() fileAssignment: FileAssignment){
        const data = await this.fileAssignService.findById(fileAssignment.id, {
            relations: ["assignment"]
        })

        return data.assignment;
    }
}