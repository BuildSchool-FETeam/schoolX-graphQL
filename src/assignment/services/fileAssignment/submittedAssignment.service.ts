import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SubmittedAssignment } from "src/assignment/entities/fileAssignment/SubmitAssignment.entity";
import { FileUploadType } from "src/common/interfaces/ImageUpload.interface";
import { BaseService } from "src/common/services/base.service";
import { GCStorageService, StorageFolder } from "src/common/services/GCStorage.service";
import { Repository } from "typeorm";

@Injectable()
export class SubmittedAssignmentService extends BaseService<SubmittedAssignment> {
    constructor(
        @InjectRepository(SubmittedAssignment)
        private submittedAssignRepo: Repository<SubmittedAssignment>,
        private gcStorageService: GCStorageService
    ) {
        super(submittedAssignRepo)
    }

    // async create(data: SubmitAssignmentSetInput, order: number = 1) {
    //     const {publicUrl} = await this.updateFile(data.file)

    //     const submitAssign = await this.submittedAssignRepo.create({
    //         ...data,
    //         fileUrl: publicUrl,
    //         order
    //     })

    //     return this.submittedAssignRepo.save(submitAssign);
    // }

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