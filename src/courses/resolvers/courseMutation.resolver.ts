import { Course } from 'src/courses/entities/Course.entity';
import { GCStorageService, StorageFolder } from './../../common/services/GCStorage.service';
import { FileUploadType } from './../../common/interfaces/ImageUpload.interface';
import { CourseSetInput, CourseType } from './../../graphql';
import { CourseService } from './../services/course.service';
import { Args, Mutation, ResolveField, Resolver } from "@nestjs/graphql";
import * as _ from 'lodash';

@Resolver('CourseMutation')
export class CourseMutationResolver {
  constructor(
    private courseService: CourseService,
    private gcStorageService: GCStorageService
  ) { }

  @Mutation()
  courseMutation () {
    return {}
  }

  @ResolveField()
  async setCourse (
    @Args('data') data: CourseSetInput,
    @Args('id') id?: string
  ): Promise<CourseType> {
    const { image } = data;
    let imageUrl: string, filePath: string;
    let existedCourse: Course;

    if (id) {
      existedCourse = await this.courseService.findById(id);
    }

    if (image) {
      if (existedCourse?.filePath) {
        this.gcStorageService.deleteFile(existedCourse.filePath);
      }
      const { filename, createReadStream } = (await image) as FileUploadType;
      const readStream = createReadStream();

      const result = await this.gcStorageService.uploadFile({
        fileName: filename,
        readStream,
        type: StorageFolder.course,
        makePublic: true
      })
      imageUrl = result.publicUrl;
      filePath = result.filePath;
    }

    let course: Course;
    const savedObj = {
      ..._.omit(data, 'image'),
      imageUrl,
      filePath
    }

    if (id) {
      course = await this.courseService.updateCourse(id, savedObj)
    } else {
      course = await this.courseService.createCourse(savedObj)
    }

    return {
      ...course,
      benefits: course.benefits.split('|'),
      requirements: course.requirements.split('|')
    }
  }
}