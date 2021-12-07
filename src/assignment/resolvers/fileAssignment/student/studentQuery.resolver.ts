import { Args, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { StudentService } from "src/assignment/services/fileAssignment/student.service";

@Resolver("StudentQuery")
export class StudentQueryResolver {

    constructor(private sutdentService: StudentService){}

    @Query()
    studentQuery() {
        return {}
    }

    @ResolveField()
    async student(
        @Args("id") id: string
    ){
        return await this.sutdentService.findById(id)
    }
}