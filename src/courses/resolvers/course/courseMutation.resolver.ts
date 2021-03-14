import { AdminUserService } from 'src/AdminUser/services/AdminUser.service';
import { UseGuards } from '@nestjs/common';
import { Course } from 'src/courses/entities/Course.entity';
import {
  GCStorageService,
  StorageFolder,
} from 'src/common/services/GCStorage.service';
import { FileUploadType } from 'src/common/interfaces/ImageUpload.interface';
import { CourseSetInput } from 'src/graphql';
import { CourseService } from '../../services/course.service';
import { Args, Mutation, ResolveField, Resolver, Context } from '@nestjs/graphql';
import * as _ from 'lodash';
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';

@UseGuards(AuthGuard)
@Resolver('CourseMutation')
export class CourseMutationResolver {
  constructor(
    private courseService: CourseService,
    private gcStorageService: GCStorageService,
    private adminUserService: AdminUserService
  ) {}

  @Mutation()
  courseMutation() {
    return {};
  }

  @PermissionRequire({ course: ['C', 'U'] })
  @ResolveField()
  async setCourse (
    @Args('data') data: CourseSetInput,
    @Context() { req }: any,
    @Args('id') id?: string
  ) {
    const { image } = data;
    let imageUrl: string, filePath: string;
    let existedCourse: Course;

    const token = _.split(req.headers.authorization, ' ')[1]
    const adminUser = await this.adminUserService.getAdminUserByToken(token);

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
      createdBy: adminUser
    };

    if (id) {
      course = await this.courseService.updateCourse(id, savedObj);
    } else {
      course = await this.courseService.createCourse(savedObj);
    }

    return {
      ...course,
      benefits: course.benefits.split('|'),
      requirements: course.requirements.split('|'),
    };
  }

  @PermissionRequire({ course: ['D'] })
  @ResolveField()
  async deleteCourse(@Args('id') id: string) {
    const course = await this.courseService.findById(id);

    if (course.filePath) {
      this.gcStorageService.deleteFile(course.filePath);
    }

    await this.courseService.deleteOneById(id);
    return true;
  }  

  private async processImage (existedCourse: Course, image: any) {
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
    });
    return result;
  }
}
