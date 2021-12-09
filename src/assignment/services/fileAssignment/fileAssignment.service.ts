import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Assignment } from "src/assignment/entities/Assignment.entity";
import { FileAssignment } from "src/assignment/entities/fileAssignment/fileAssignment.entity";
import { BaseService } from "src/common/services/base.service";
import { LessonService } from "src/courses/services/lesson.service";
import { EvaluationInput, FileAssignmentSetInput, SubmitInput } from "src/graphql";
import { Repository } from "typeorm";
import { AssignmentService } from "../assignment.service";
import * as _ from "lodash"
import { GroupAssignmentService } from "./groupAssignment.service";
import { GroupAssignment } from "src/assignment/entities/fileAssignment/groupAssignment.entity";
import { ClientUserService } from "src/clientUser/services/clientUser.service";

@Injectable()
export class FileAssignmentService extends BaseService<FileAssignment>{
    constructor(
        @InjectRepository(FileAssignment)
        private fileAssignRepo: Repository<FileAssignment>,
        @Inject(forwardRef(() => LessonService))
        private lessonService: LessonService,
        @Inject(forwardRef(() => AssignmentService))
        private assignService: AssignmentService,
        private groupAssignService: GroupAssignmentService,
        private clientUserService: ClientUserService
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

    async firstSubmit(id: string,data: SubmitInput, userId: string) {
        const fileAssign = await this.queryDeepById(id);

        const checkJoinedCourse = await this.clientUserService.checkUserJoinedCourse(userId, fileAssign.assignment.lesson.course);
        if(!checkJoinedCourse) {
            throw new BadRequestException(`User with id ${userId} isn't join this course`)
        }

        let groupAssignments: GroupAssignment[]; 

        if(!fileAssign.groupAssignments) {
            groupAssignments = [];
        }else {
            const checkGroupExits = _.some(fileAssign.groupAssignments, ["user.id", userId]);
            if(checkGroupExits) {
                throw new BadRequestException("Group is already exits");
            }
            groupAssignments = _.cloneDeep(fileAssign.groupAssignments);
        }

        const groupAssign = await this.groupAssignService.create(data, userId);

        groupAssignments.push(groupAssign)
        fileAssign.groupAssignments = groupAssignments;
        this.fileAssignRepo.save(fileAssign)
        return groupAssign;
    }

    async submit(id: string, data: SubmitInput, userId: string) {
        const fileAssign = await this.queryDeepById(id);
        const checkJoinedCourse = await this.clientUserService.checkUserJoinedCourse(userId, fileAssign.assignment.lesson.course);
        if(!checkJoinedCourse) {
            throw new BadRequestException(`User with id ${userId} isn't join this course`)
        }
        return await this.groupAssignService.update(id, data, userId);
    }

    async evaluation(id: string, data: EvaluationInput, token: string) {
        return await this.groupAssignService.evaluation(id, data, token);
    }

    async queryDeepById(id: string) {
        const fileAssign = await this.fileAssignRepo.createQueryBuilder("fileAssignment")
            .leftJoinAndSelect("fileAssignment.groupAssignments", "groupAssignments")
            .leftJoinAndSelect("groupAssignments.user", "user")
            .leftJoinAndSelect("fileAssignment.assignment", "assignment")
            .leftJoinAndSelect("assignment.lesson", "lesson")
            .leftJoinAndSelect("lesson.course", "course")
            .where("fileAssignment.id = :fileAssignmentId", {
                fileAssignmentId : id
            }).getOne()
        return fileAssign;
    }
}