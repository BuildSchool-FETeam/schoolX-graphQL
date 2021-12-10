import { BadRequestException, Res, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import * as _ from 'lodash';
import { TestCaseProgrammingLanguage } from 'src/assignment/entities/codeChallenge/Testcase.entity';
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { FileUploadType } from 'src/common/interfaces/ImageUpload.interface';
import {
  GCStorageService,
  StorageFolder,
} from 'src/common/services/GCStorage.service';
import { Lesson } from 'src/courses/entities/Lesson.entity';
import { LessonDocument } from 'src/courses/entities/LessonDocument.entity';
import { LessonDocumentService } from 'src/courses/services/document.service';
import { LessonService } from 'src/courses/services/lesson.service';
import { CodeChallengeSetInput, CodeConfigInput, EvaluationInput, FileAssignmentSetInput, LessonSetInput, QuizSetInput, SubmitInput } from 'src/graphql';

@UseGuards(AuthGuard)
@Resolver('LessonMutation')
export class LessonMutationResolver {
  constructor(
    private lessonService: LessonService,
    private documentService: LessonDocumentService,
    private storageService: GCStorageService,
  ) {}

  @Mutation()
  lessonMutation() {
    return {};
  }

  @ResolveField()
  async setLesson(@Args('data') data: LessonSetInput, @Args('id') id?: string) {
    let lesson: Lesson;
    let promises: Array<Promise<LessonDocument>> = [];

    if (!id) {
      let allDocs: FileUploadType[] = [];

      _.size(data.documents) > 0 &&
        (allDocs = (await Promise.all(data.documents)) as FileUploadType[]);
      lesson = await this.lessonService.createLesson(data);

      if (_.size(allDocs) > 0) {
        promises = _.map(allDocs, (doc) =>
          this.uploadFileAndAddDocument(doc, lesson),
        );
      }
    } else {
      if (_.size(data.documents) > 0) {
        throw new BadRequestException(
          'No need to upload all document in update mode, use document graphQL API instead',
        );
      }
      lesson = await this.lessonService.updateLesson(id, data);
    }

    await Promise.all(promises);

    return {
      ...lesson,
    };
  }

  @ResolveField()
  async deleteLesson(@Args('id') id: string) {
    return !!(await this.lessonService.deleteOneById(id));
  }

  private async uploadFileAndAddDocument(
    { createReadStream, filename }: FileUploadType,
    lesson: Lesson,
  ) {
    const fileStream = createReadStream();
    const { filePath, publicUrl } = await this.storageService.uploadFile({
      fileName: filename,
      readStream: fileStream,
      type: StorageFolder.documents,
      makePublic: true,
      additionalPath: `lesson-${lesson.id}`,
    });

    return await this.documentService.addDocumentToLesson(lesson, {
      title: filename,
      url: publicUrl,
      filePath,
    });
  }

  @ResolveField()
  setCodeChallenge(
    @Args('id') id: string,
    @Args('data') data: CodeChallengeSetInput,
  ) {
    return this.lessonService.setCodeChallenge(id, data);
  }

  @ResolveField()
  deleteCodeChallenge(
    @Args('id') id: string
  ){
    return this.lessonService.deleteCodeChallenge(id);
  }

  @ResolveField()
  runCode(
    @Args("code") code: string,
    @Args("language") language: TestCaseProgrammingLanguage
  ){
    return this.lessonService.runCode(code, language);
  }

  @ResolveField()
  runTestCase(
    @Args('challengeId') challengeId: string,
    @Args('data') data: CodeConfigInput
  ){
    return this.lessonService.runTestCase(challengeId, data);
  }

  @ResolveField()
  setQuiz(
    @Args('id') id: string,
    @Args('data') data: QuizSetInput
  ){
    return this.lessonService.setQuiz(id, data);
  }

  @ResolveField()
  deleteQuiz(
    @Args('id') id: string
  ) {
    return this.lessonService.deleteQuiz(id);
  }

  @ResolveField()
  setFileAssignment(
    @Args("id") id: string,
    @Args("data") data: FileAssignmentSetInput
  ){
    return this.lessonService.setFileAssignment(id, data);
  }

  @ResolveField()
  deleteFileAssignment(
    @Args("id") id: string
  ){
    return this.lessonService.deleteFileAssignment(id);
  }

  @ResolveField()
  submitAssignment(
    @Args("fileAssignmentId") fileAssignmentId: string,
    @Args("data") data: SubmitInput,
    @Context() { req }: any
  ){
    const userId = this.lessonService.getIdUserByHeader(req.headers);

    return this.lessonService.submitAssignment(fileAssignmentId, data, userId);
  }

  @ResolveField()
  evaluationAssignment(
    @Args("groupAssignmentId") groupAssignmentId: string,
    @Args("data") data: EvaluationInput,
    @Context() { req }: any
  ){

    const token = this.lessonService.getTokenFromHttpHeader(req.headers)
    return this.lessonService.evaluation(groupAssignmentId, data, token)
  }
}
