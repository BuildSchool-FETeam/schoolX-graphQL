import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SubmitAssignment } from "src/assignment/entities/fileAssignment/SubmitAssignment.entity";
import { BaseService } from "src/common/services/base.service";
import { Repository } from "typeorm";

@Injectable()
export class SubmitAssignmentService extends BaseService<SubmitAssignment> {
    constructor(
        @InjectRepository(SubmitAssignment)
        private submitAssignRepo: Repository<SubmitAssignment>
    ) {
        super(submitAssignRepo)
    }
}