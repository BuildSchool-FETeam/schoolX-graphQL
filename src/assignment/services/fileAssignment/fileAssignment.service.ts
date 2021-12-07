import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Assignment } from "src/assignment/entities/Assignment.entity";
import { FileAssignment } from "src/assignment/entities/fileAssignment/fileAssignment.entity";
import { BaseService } from "src/common/services/base.service";
import { LessonService } from "src/courses/services/lesson.service";
import { FileAssignmentSetInput } from "src/graphql";
import { Repository } from "typeorm";
import { AssignmentService } from "../assignment.service";
import * as _ from "lodash"

@Injectable()
export class FileAssignmentService extends BaseService<FileAssignment>{
    constructor(
        @InjectRepository(FileAssignment)
        private fileAssignRepo: Repository<FileAssignment>,
        @Inject(forwardRef(() => LessonService))
        private lessonService: LessonService,
        @Inject(forwardRef(() => AssignmentService))
        private assignService: AssignmentService
    ) {
        super(fileAssignRepo)
    }
    
    async create(data: FileAssignmentSetInput) {
        const lesson = await this.lessonService.findById(data.lessonId, {
            relations: ["assignment"]
        })

        let assignment: Assignment;

        if(!lesson.assignment) {
            assignment = await this.assignService.createAssignment(data.lessonId);
        }else {
            assignment = await this.assignService.findById(lesson.assignment.id);
        }

        const fileAssignment = await this.fileAssignRepo.create({
            ...data,
            assignment
        })

        return this.fileAssignRepo.save(fileAssignment);
    }

    async update(id: string, data: FileAssignmentSetInput) {
        const [lesson, fileAssignment] = await Promise.all([
            this.lessonService.findById(data.lessonId, {relations: ["assignment"]}),
            this.findById(id, {relations: ["assignment"]})
        ])

        if(lesson.assignment.id !== fileAssignment.assignment.id) {
            throw new BadRequestException(`Lesson with id ${lesson.id} is not contain this file assignment`);
        }

        _.forOwn(data, (value, key) => {
            if(key === "lessonId"){
                fileAssignment.assignment = lesson.assignment;
            } else {
                value && (fileAssignment[key] = value);
            }
        });

        return this.fileAssignRepo.save(fileAssignment);
    }

    async delete(id: string) {
        const fileAssignment = await this.findById(id, {
            relations: ["assignment"]
        });
        const assignment = await this.assignService.findById(fileAssignment.assignment.id, {
            relations: ["fileAssignments"]
        })

        const checkAvailable = _.some(assignment.fileAssignments, ['id', parseInt(id)]);
      
        if(!checkAvailable) {
            return false;
        }

        const deleted = await this.deleteOneById(id);
        this.assignService.deleteAssgin(assignment.id);
          
        return !!deleted;
    }
}