import { UseGuards } from '@nestjs/common';
import { Instructor } from 'src/instructor/entities/Instructor.entity';
import {
  Args,
  Context,
  Mutation,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { FileUploadType } from 'src/common/interfaces/ImageUpload.interface';
import * as _ from 'lodash';
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import {
  GCStorageService,
  StorageFolder,
} from 'src/common/services/GCStorage.service';
import { InstructorSetInput } from 'src/graphql';
import { InstructorService } from '../services/instructor.service';

@UseGuards(AuthGuard)
@Resolver('InstructorMutation')
export class InstructorMutationResolver {
  constructor(
    private instructorService: InstructorService,
    private gcStorageService: GCStorageService,
  ) {}

  @Mutation()
  instructorMutation() {
    return {};
  }

  @PermissionRequire({ instructor: ['C', 'U'] })
  @ResolveField()
  async setInstructor(
    @Args('data') data: InstructorSetInput,
    @Context() { req }: DynamicObject,
    @Args('id') id?: string,
  ) {
    const { image } = data;
    let imageUrl = '';
    let imgPath = '';
    let existedInstructor: Instructor;

    const token = this.instructorService.getTokenFromHttpHeader(req.headers);

    if (id) {
      existedInstructor = await this.instructorService.findById(
        id,
        {},
        { token, strictResourceName: 'instructor' },
      );
    }

    if (image) {
      if (existedInstructor?.filePath) {
        await this.gcStorageService.deleteFile(existedInstructor.filePath);
      }
      const { filename, createReadStream } = (await image) as FileUploadType;
      const readStream = createReadStream();
      const promiseObj = await this.gcStorageService.uploadFile({
        fileName: filename,
        readStream,
        type: StorageFolder.instructor,
        makePublic: true,
        imageProcessConfig: {
          resize: {
            height: 450,
            width: 450,
          },
          changeFormat: 'jpeg',
          isSharpen: true,
        },
      });
      imageUrl = promiseObj.publicUrl;
      imgPath = promiseObj.filePath;
    }

    const dataWithoutImg = _.omit(data, 'image');
    const savedObj = {
      ...dataWithoutImg,
      imageUrl,
      filePath: imgPath,
    };

    let ins: Instructor;
    if (!id) {
      ins = await this.instructorService.createInstructor(savedObj, token);
    } else {
      ins = await this.instructorService.updateInstructor(id, savedObj);
    }

    return ins;
  }

  @PermissionRequire({ instructor: ['D'] })
  @ResolveField()
  async deleteInstructor(
    @Args('id') id: string,
    @Context() { req }: DynamicObject,
  ): Promise<boolean> {
    const token = this.instructorService.getTokenFromHttpHeader(req.headers);
    const inst = await this.instructorService.findById(
      id,
      {},
      { token, strictResourceName: 'instructor' },
    );

    if (inst.filePath) {
      this.gcStorageService.deleteFile(inst.filePath);
    }

    await this.instructorService.deleteOneById(id);
    return true;
  }
}
