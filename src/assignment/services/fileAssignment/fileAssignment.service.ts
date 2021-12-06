import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileAssignment } from "src/assignment/entities/fileAssignment/fileAssignment.entity";
import { BaseService } from "src/common/services/base.service";
import { Repository } from "typeorm";

@Injectable()
export class FileAssignmentService extends BaseService<FileAssignment>{
    constructor(
        @InjectRepository(FileAssignment)
        private fileAssignRepo: Repository<FileAssignment>
    ) {
        super(fileAssignRepo)
    }
}