import { Args, Context, Mutation, ResolveField, Resolver } from "@nestjs/graphql";
import { StudentService } from "src/assignment/services/fileAssignment/student.service";
import { TokenService } from "src/common/services/token.service";
import { StudentSetInput } from "src/graphql";

@Resolver("StudentMutation")
export class StudentMutationResolver {

    constructor(
        private studentService: StudentService
    ){}

    @Mutation()
    studentMutation() {
        return {}
    }

    @ResolveField()
    setStudent(
        @Args("id") id: string,
        @Args("data") data: StudentSetInput,
        @Context() {req } : any 
    ) {
        const userId = this.studentService.getIdUserByHeader(req.headers);

        if(!id) {
            return this.studentService.create(data, userId);
        }
        return this.studentService.update(id, data);
    }

    @ResolveField()
    async deleteStudent(
        @Args("id") id: string,
    ) {
        return !!(await this.studentService.deleteOneById(id));
    }

}