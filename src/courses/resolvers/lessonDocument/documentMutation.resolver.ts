import { StorageFolder } from './../../../common/services/GCStorage.service';

import { GCStorageService } from 'src/common/services/GCStorage.service';
import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { AddDocumentInput } from 'src/graphql';
import { FileUploadType } from 'src/common/interfaces/ImageUpload.interface';
import { LessonDocumentService } from 'src/courses/services/document.service';

@Resolver('DocumentMutation')
export class LessonDocumentMutationResolver {
  constructor(
    private documentService: LessonDocumentService,
    private gcStorageService: GCStorageService
  ) { }

  @Mutation()
  documentMutation () {
    return {}
  }

  @ResolveField()
  async addDocumentToLesson (@Args('lessonId') lessonId: string, @Args('data') data: AddDocumentInput) {
    const { filename, createReadStream } = (await data.file) as FileUploadType

    const { publicUrl, filePath } = await this.gcStorageService.uploadFile({
      fileName: filename,
      readStream: createReadStream(),
      type: StorageFolder.documents,
      makePublic: true,
      additionalPath: `lesson-${lessonId}`
    })
    const doc = await this.documentService.addDocumentToLesson(lessonId, {
      title: data.title,
      url: publicUrl,
      filePath
    })

    return doc;
  }

  @ResolveField()
  async removeDocumentFromLesson (@Args('docId') id: string) {
    const doc = await this.documentService.findById(id);
    await this.documentService.removeDocFromLesson(doc.id);
    this.gcStorageService.deleteFile(doc.filePath);
    return true
  }
}