import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Student } from "src/assignment/entities/fileAssignment/student.entity";
import { StudentService } from "src/assignment/services/fileAssignment/student.service";

@Resolver("StudentType")
export class StudentTypeResolver {
    constructor(
        private studentService: StudentService
    ){}

    @ResolveField()
    async user(@Parent() student: Student) {
        const data = await this.studentService.findById(student.id, {
            relations: ["user"]
        })

        return data.user;
    }

    @ResolveField()
    async submitAssignments(@Parent() student: Student) {
        const data = await this.studentService.findById(student.id, {
            relations: ["submitAssignments"]
        })

        return data.submitAssignments;
    }

    @ResolveField()
    async fileAssignment(@Parent() student: Student) {
        const data = await this.studentService.findById(student.id, {
            relations: ["fileAssignment"]
        })

        return data.fileAssignment;
    }
}