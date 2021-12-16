import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as _ from "lodash";
import { GroupAssignment } from "src/assignment/entities/fileAssignment/groupAssignment.entity";
import { SubmittedAssignment } from "src/assignment/entities/fileAssignment/SubmittedAssignment.entity";
import { ClientUserService } from "src/clientUser/services/clientUser.service";
import { BaseService } from "src/common/services/base.service";
import { TokenService } from "src/common/services/token.service";
import { EvaluationInput, SubmitInput } from "src/graphql";
import { Repository } from "typeorm";
import { FileAssignmentService } from "./fileAssignment.service";
import { SubmittedAssignmentService } from "./submittedAssignment.service";

@Injectable()
export class GroupAssignmentService extends BaseService<GroupAssignment> {
    constructor( 
        @InjectRepository(GroupAssignment)
        private groupAssignRepo: Repository<GroupAssignment>,
        private clientUserService: ClientUserService,
        private submittedAssignService: SubmittedAssignmentService,
        private tokenService: TokenService
    ) { super(groupAssignRepo) }

    async create(data: SubmitInput, userID: string) {
        const [user, submitted] = await Promise.all([
            this.clientUserService.findById(userID),
            this.submittedAssignService.submit(data),
        ]);

        const groupAssignment = await this.groupAssignRepo.create({
            title: user.name,
            user,
            submitteds: [submitted]
        })

        return this.groupAssignRepo.save(groupAssignment);
    }

    async update(id: string, data: SubmitInput, userId: string) {
        const group = await this.findById(data.groupAssignmentId, {
            relations: ["user", "submitteds", "fileAssignment"]
        })

        if(id !== group.fileAssignment.id.toString()) {
            throw new BadRequestException(`this assignment doesn't contain submitted assignment with id ${data.groupAssignmentId}`)
        }

        if(group.user.id !== userId) {
            throw new BadRequestException(`user with id ${userId} can't excute this action`)
        }

        let submittedAssignment: SubmittedAssignment;
        let submittedAssignments: SubmittedAssignment[];

        if(!group.submitteds) {
            submittedAssignment = await this.submittedAssignService.submit(data);
            submittedAssignments = [];
        }else {
            submittedAssignment = await this.submittedAssignService.submit(data, group.submitteds.length + 1);
            submittedAssignments = _.cloneDeep(group.submitteds);
        }

        submittedAssignments.push(submittedAssignment);
        group.submitteds = submittedAssignments;
        group.isUpdated = true;

        return this.groupAssignRepo.save(group);
    }

    async evaluation(id: string, data: EvaluationInput, token: string) {
        const group = await this.findById(id, {
            relations: ["submitteds", "fileAssignment"]
        })
        if(group.submitteds.length < data.order) { 
            throw new BadRequestException(`Submitted with order = ${data.order} doesn't exits`) 
        }
        const submitted = _.find(group.submitteds, ["order", data.order])
        if(data.scoreInput) {
            const user = this.tokenService.verifyAndDecodeToken(token);
            if(data.scoreInput.score > group.fileAssignment.maxScore){
                data.scoreInput.score = group.fileAssignment.maxScore
            }
            this.clientUserService.updateScore(user.id, data.scoreInput);
        }

        await this.submittedAssignService.evaluation(submitted.id, data, token);

        return group;
    }

    async delete(id: string) {
        return !!(await this.deleteOneById(id))
    }

    async view(id: string) {
        const group = await this.findById(id);

        group.isUpdated = false;

        this.groupAssignRepo.save(group);

        return true;
    }

    async viewSubmitted(id: string, order: number) {
        const group = await this.findById(id, {relations: ["submitteds"]});

        if(group.submitteds.length < order) { 
            throw new BadRequestException(`Submitted with order = ${order} doesn't exits`) 
        }

        const submitted = _.find(group.submitteds, ["order", order]);

        return await this.submittedAssignService.view(submitted.id);
    }
}