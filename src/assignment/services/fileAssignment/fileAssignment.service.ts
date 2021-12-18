import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Assignment } from "src/assignment/entities/Assignment.entity";
import { FileAssignment } from "src/assignment/entities/fileAssignment/fileAssignment.entity";
import { BaseService } from "src/common/services/base.service";
import { LessonService } from "src/courses/services/lesson.service";
import { EvaluationInput, FileAssignmentSetInput, SearchOptionInput, SubmitInput } from "src/graphql";
import { Brackets, ILike, Repository } from "typeorm";
import { AssignmentService } from "../assignment.service";
import * as _ from "lodash"
import { GroupAssignmentService } from "./groupAssignment.service";
import { GroupAssignment } from "src/assignment/entities/fileAssignment/groupAssignment.entity";
import { ClientUserService } from "src/clientUser/services/clientUser.service";
import { isArray } from "lodash";

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

        const [fileAssign, user] = await Promise.all([
            this.findById(id, {relations: ["submittedGroupAssignments"]}),
            this.clientUserService.findById(userId, {relations: ["submittedGroupAssignments"]})
        ])
        let groupAssignments: GroupAssignment[]; 

        if(!fileAssign.submittedGroupAssignments) {
            groupAssignments = [];
        }else {
            const checkGroupExits = _.differenceBy(
                fileAssign.submittedGroupAssignments, 
                user.submittedGroupAssignments,
                "id"
            );
            if(checkGroupExits.length < fileAssign.submittedGroupAssignments.length) {
                throw new BadRequestException("Group is already exits");
            }
            groupAssignments = _.cloneDeep(fileAssign.submittedGroupAssignments);
        }

        const groupAssign = await this.groupAssignService.create(data, userId);

        groupAssignments.push(groupAssign)
        fileAssign.submittedGroupAssignments = groupAssignments;
        this.fileAssignRepo.save(fileAssign)
        return groupAssign;
    }

    async submit(id: string, data: SubmitInput, userId: string) {
        return await this.groupAssignService.update(id, data, userId);
    }

    async evaluation(id: string, data: EvaluationInput, token: string) {
        return await this.groupAssignService.evaluation(id, data, token);
    }

    async searchGroupAssign(fileAssignId: string, searchOpt: SearchOptionInput) {

        const fileAssign = await this.fileAssignRepo.createQueryBuilder("fileAssignment")
        .innerJoinAndSelect("fileAssignment.submittedGroupAssignments", "submittedGroupAssignments")
        .innerJoinAndSelect("submittedGroupAssignments.user", "user")
        .where("fileAssignment.id = :id", {id: fileAssignId})
        
        searchOpt && fileAssign.andWhere(
            new Brackets(qb => {
                _.each(searchOpt.searchFields, (field, index) => {
                    let queryString: string; 
                    let queryVar: string;
                    const queryField = field.split(".")
        
                    if(queryField.length > 1){
                        queryString = `${field}`
                        queryVar = queryField[0]
                    }else {
                        queryString = `submittedGroupAssignments.${field}`
                        queryVar = field
                    }
                
                    if(index === 0) {
                        qb.where(`${queryString} ilike :${queryVar}`, {[queryVar]: `%${searchOpt.searchString}%`})
                    }else {
                        qb.orWhere(`${queryString} ilike :${queryVar}`, {[queryVar]: `%${searchOpt.searchString}%`})
                    }
                })
            })
        )

        const data = await fileAssign.getOne();

        return data;
    }

    async viewSubmittedAssign(groupAssignId: string, order: number) {
        return await this.groupAssignService.viewSubmitted(groupAssignId, order)
    }
}