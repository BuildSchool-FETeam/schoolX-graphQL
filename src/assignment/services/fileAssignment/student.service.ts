import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as _ from "lodash";
import { Student } from "src/assignment/entities/fileAssignment/student.entity";
import { ClientUserService } from "src/clientUser/services/clientUser.service";
import { BaseService } from "src/common/services/base.service";
import { TokenService } from "src/common/services/token.service";
import { StudentSetInput } from "src/graphql";
import { Repository } from "typeorm";
import { FileAssignmentService } from "./fileAssignment.service";
import { SubmitAssignmentService } from "./submitAssignment.service";

@Injectable()
export class StudentService extends BaseService<Student> {
    constructor(
        @InjectRepository(Student)
        private studentRepo: Repository<Student>,
        private fileAssignService: FileAssignmentService,
        private clientUserService: ClientUserService,
        private submitAssignService: SubmitAssignmentService,
        private tokenService: TokenService
    ){
        super(studentRepo)
    }

    async create(data: StudentSetInput, userId: string) {
        const [fileAssign, user] = await Promise.all([
            this.fileAssignService.findById(data.fileAssignmentId),
            this.clientUserService.findById(userId)
        ]);

        const submitAssign = await this.submitAssignService.create(data.submitAssignment);
        
        const student = await this.studentRepo.create({
            ...data,
            fileAssignment: fileAssign,
            user,
            submitAssignments: [submitAssign],
        })

        return await this.studentRepo.save(student);
    }

    async update(id: string, data: StudentSetInput) {
        const student = await this.findById(id, {
            relations: ["submitAssignments", "fileAssignment"]
        })

        if(student.fileAssignment.id.toString() !== data.fileAssignmentId) {
            throw new BadRequestException(`File Assignment with id ${data.fileAssignmentId} is not contain this student`)
        }

        const submitAssign = await this.submitAssignService.create(data.submitAssignment, ++student.submitAssignments.length)

        _.forOwn(data, (value, key) => {
            if(key = "submitAssignment") {
                student.submitAssignments.push(submitAssign)
            }else{
                student[key] = value;
            }
        })

        return await this.studentRepo.save(student);
    }

    getIdUserByHeader(headers) {
        const token = this.getTokenFromHttpHeader(headers);
        const {id} = this.tokenService.verifyAndDecodeToken(token);

        return id;
    }

}