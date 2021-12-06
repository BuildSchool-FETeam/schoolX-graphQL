import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Student } from "src/assignment/entities/fileAssignment/student.entity";
import { BaseService } from "src/common/services/base.service";
import { Repository } from "typeorm";

@Injectable()
export class StudentService extends BaseService<Student> {
    constructor(
        @InjectRepository(Student)
        private studentRepo: Repository<Student>
    ){
        super(studentRepo)
    }
}