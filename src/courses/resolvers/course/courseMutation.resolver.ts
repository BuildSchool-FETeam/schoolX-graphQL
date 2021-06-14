import { UseGuards } from '@nestjs/common';
import { Course } from 'src/courses/entities/Course.entity';
import {
  GCStorageService,
  StorageFolder,
} from 'src/common/services/GCStorage.service';
import { FileUploadType } from 'src/common/interfaces/ImageUpload.interface';
import { CourseSetInput } from 'src/graphql';
import { CourseService } from '../../services/course.service';
import {
  Args,
  Mutation,
  ResolveField,
  Resolver,
  Context,
} from '@nestjs/graphql';
import * as _ from 'lodash';
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { TokenService } from 'src/common/services/token.service';

@UseGuards(AuthGuard)
@Resolver('CourseMutation')
export class CourseMutationResolver {
  constructor(
    private courseService: CourseService,
    private gcStorageService: GCStorageService,
    private tokenService: TokenService,
  ) {}

  @Mutation()
  courseMutation() {
    return {};
  }

  @PermissionRequire({ course: ['C', 'U'] })
  @ResolveField()
  async setCourse(
    @Args('data') data: CourseSetInput,
    @Context() { req }: any,
    @Args('id') id?: string,
  ) {
    const { image } = data;
    let imageUrl: string, filePath: string;
    let existedCourse: Course;

    const token = this.courseService.getTokenFromHttpHeader(req.headers);
    const adminUser = await this.tokenService.getAdminUserByToken(token);

    if (id) {
      existedCourse = await this.courseService.findById(id);
    }

    if (image) {
      const result = await this.processImage(existedCourse, image);
      imageUrl = result.publicUrl;
      filePath = result.filePath;
    }

    let course: Course;
    const savedObj = {
      ..._.omit(data, 'image'),
      imageUrl,
      filePath,
      createdBy: adminUser,
    };

    if (id) {
      course = await this.courseService.updateCourse(id, savedObj, {
        token,
        strictResourceName: 'course',
      });
    } else {
      course = await this.courseService.createCourse(savedObj);
    }

    return {
      ...course,
    };
  }

  @PermissionRequire({ course: ['D'] })
  @ResolveField()
  async deleteCourse(@Args('id') id: string, @Context() { req }: any) {
    const token = this.courseService.getTokenFromHttpHeader(req.headers);
    const course = await this.courseService.findById(
      id,
      { relations: ['tags'] },
      { token, strictResourceName: 'course' },
    );

    if (course.filePath) {
      this.gcStorageService.deleteFile(course.filePath);
    }

    await this.courseService.removeCourseFormTag(id, _.map(course.tags, 'id'));

    await this.courseService.deleteOneById(id);
    return true;
  }

  private async processImage(existedCourse: Course, image: any) {
    if (existedCourse?.filePath) {
      this.gcStorageService.deleteFile(existedCourse.filePath);
    }
    const { filename, createReadStream } = (await image) as FileUploadType;
    const readStream = createReadStream();

    const result = await this.gcStorageService.uploadFile({
      fileName: filename,
      readStream,
      type: StorageFolder.course,
      makePublic: true,
      imageProcessConfig: {
        resize: {
          width: 1200,
        },
        changeFormat: 'jpeg',
      },
    });
    return result;
  }
}
