import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as _ from "lodash";
import { SubmittedAssignment } from "src/assignment/entities/fileAssignment/SubmittedAssignment.entity";
import { UserComment } from "src/comment/entities/UserComment.entity";
import { UserCommentService } from "src/comment/services/userComment.service";
import { FileUploadType } from "src/common/interfaces/ImageUpload.interface";
import { BaseService } from "src/common/services/base.service";
import { GCStorageService, StorageFolder } from "src/common/services/GCStorage.service";
import { EvaluationInput, SubmitInput } from "src/graphql";
import { Repository } from "typeorm";

@Injectable()
export class SubmittedAssignmentService extends BaseService<SubmittedAssignment> {
    constructor(
        @InjectRepository(SubmittedAssignment)
        private submittedAssignRepo: Repository<SubmittedAssignment>,
        private gcStorageService: GCStorageService,
        private userCommentService: UserCommentService
    ) {
        super(submittedAssignRepo)
    }

    async submit(data: SubmitInput, order: number = 1) {
        const {publicUrl} = await this.updateFile(data.file)

        const submitAssign = await this.submittedAssignRepo.create({
            ...data,
            fileUrl: publicUrl,
            order
        })

        return this.submittedAssignRepo.save(submitAssign);
    }

    async evaluation(id: string, dataUpdate: EvaluationInput, token: string) {
        const data = await this.findById(id, {
            relations: ["comments"]
        })

        let comment: UserComment;
        if(dataUpdate.comment) {
            comment = await this.userCommentService.setCommentForSubmittedAssign(data.id, dataUpdate.comment, token)
        }

        const cloneData = _.cloneDeep(data);
        _.forOwn(dataUpdate, (value, key) => {
            if(key === "reApply") {
                cloneData.reApply = value as boolean;
            }else if((key === "comment") && value) {
                if(!data.comments) {
                    cloneData.comments = [comment]
                }else {
                    cloneData.comments.push(comment)
                }
            }else {
                value && (cloneData[key] = value)
            }
        })

        return this.submittedAssignRepo.save(cloneData);
    }

    private async updateFile(file: any) {
        
        const {filename, mimetype, createReadStream} = (await file) as FileUploadType;
        if(mimetype !== "application/zip") {
            throw new BadRequestException("you can only update file .zip")
        }
        const readStream = createReadStream();

        return await this.gcStorageService.uploadFile({
            fileName: filename,
            readStream,
            type: StorageFolder.course,
            makePublic: true,
        })
    }
}