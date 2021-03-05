import {
  FileUpload,
  InstructorSetInput,
  InstructorType,
} from './../../graphql';
import { InstructorService } from './../services/instructor.service';
import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { FileUploadType } from 'src/common/interfaces/ImageUpload.interface';
import { FileService } from 'src/common/services/file.service';

@Resolver('InstructorMutation')
export class InstructorMutationResolver {
  constructor(
    private instructorService: InstructorService,
    private fileService: FileService,
  ) {}

  @Mutation()
  instructorMutation() {
    return {};
  }

  @ResolveField()
  async setInstructor(@Args('data') data: InstructorSetInput) {
    const { image } = data;
    const { filename, createReadStream } = (await image) as FileUploadType;
    const readStream = createReadStream();
    const url = await this.fileService.writeFileLocal(filename, readStream);
    return;
  }
}
