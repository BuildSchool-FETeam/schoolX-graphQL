import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as _ from 'lodash'
import { EvaluationComment } from 'src/assignment/entities/fileAssignment/evaluationComment.entity'
import { SubmittedAssignment } from 'src/assignment/entities/fileAssignment/SubmittedAssignment.entity'
import { FileUploadType } from 'src/common/interfaces/ImageUpload.interface'
import { BaseService } from 'src/common/services/base.service'
import {
  GCStorageService,
  StorageFolder,
} from 'src/common/services/GCStorage.service'
import { EvaluationInput, SubmitInput } from 'src/graphql'
import { Repository } from 'typeorm'
import { EvaluationCommentService } from './evaluationComment.service'

@Injectable()
export class SubmittedAssignmentService extends BaseService<SubmittedAssignment> {
  constructor(
    @InjectRepository(SubmittedAssignment)
    private submittedAssignRepo: Repository<SubmittedAssignment>,
    private gcStorageService: GCStorageService,
    private commentEvalService: EvaluationCommentService
  ) {
    super(submittedAssignRepo)
  }

  async submit(data: SubmitInput, order = 1) {
    const publicUrl = data.file
      ? (await this.uploadFile(data.file)).publicUrl
      : null

    const submitAssign = this.submittedAssignRepo.create({
      ...data,
      fileUrl: publicUrl,
      order,
    })

    return this.submittedAssignRepo.save(submitAssign)
  }

  async evaluation(id: string, dataUpdate: EvaluationInput, token: string) {
    const data = await this.findById(id, {
      relations: { comments: true },
    })

    let comment: EvaluationComment
    if (dataUpdate.comment) {
      comment = await this.commentEvalService.setComment(
        dataUpdate.comment,
        token
      )
    }

    const cloneData = _.cloneDeep(data)
    _.forOwn(dataUpdate, (value, key) => {
      if (key === 'reApply') {
        cloneData.reApply = value as boolean
      } else if (key === 'comment' && value) {
        if (!data.comments) {
          cloneData.comments = [comment]
        } else {
          cloneData.comments.push(comment)
        }
      } else {
        value && (cloneData[key] = value)
      }
    })

    return this.submittedAssignRepo.save(cloneData)
  }

  async view(id: string) {
    const submitted = await this.findById(id)
    submitted.hasSeen = true
    this.submittedAssignRepo.save(submitted)

    return true
  }

  private async uploadFile(file: Promise<FileUploadType>) {
    const { filename, createReadStream } = await file
    const format = filename.split('.')

    if (format[format.length - 1] !== 'zip') {
      throw new BadRequestException('you can only upload file .zip')
    }
    const readStream = createReadStream()

    return await this.gcStorageService.uploadFile({
      fileName: filename,
      readStream,
      type: StorageFolder.course,
      makePublic: true,
    })
  }
}
