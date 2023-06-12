import { UseGuards } from '@nestjs/common'
import { Course } from 'src/courses/entities/Course.entity'
import {
  GCStorageService,
  StorageFolder,
} from 'src/common/services/GCStorage.service'
import { FileUploadType } from 'src/common/interfaces/ImageUpload.interface'
import { CourseSetInput } from 'src/graphql'
import {
  Args,
  Mutation,
  ResolveField,
  Resolver,
  Context,
} from '@nestjs/graphql'
import * as _ from 'lodash'
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { TokenService } from 'src/common/services/token.service'
import { CourseService } from '../../services/course.service'
import { IsActiveUser } from 'src/common/decorators/IsActiveUser.decorator'

@UseGuards(AuthGuard)
@Resolver('CourseMutation')
export class CourseMutationResolver {
  constructor(
    private courseService: CourseService,
    private gcStorageService: GCStorageService,
    private tokenService: TokenService
  ) {}

  @Mutation()
  courseMutation() {
    return {}
  }

  @PermissionRequire({ course: ['C:*', 'R:*', 'U:*', 'D:x'] })
  @IsActiveUser()
  @ResolveField()
  async setCourse(
    @Args('data') data: CourseSetInput,
    @Context() { req }: DynamicObject,
    @Args('id') id?: string
  ) {
    const { image } = data
    let imageUrl: string
    let filePath: string
    let existedCourse: Course

    const token = this.courseService.getTokenFromHttpHeader(req.headers)
    const user = await this.tokenService.getUserByToken(token)

    if (id) {
      existedCourse = await this.courseService.findById(id)
    }

    if (image) {
      const result = await this.processImage(existedCourse, image)
      imageUrl = result.publicUrl
      filePath = result.filePath
    }

    const savedObj = {
      ..._.omit(data, 'image'),
      imageUrl,
      filePath,
      createdBy: user,
    }

    if (id) {
      return this.courseService.updateCourse(id, savedObj, {
        token,
        strictResourceName: 'course',
      })
    }

    return this.courseService.createCourse(savedObj)
  }

  @PermissionRequire({ course: ['C:x', 'R:x', 'U:x', 'D:*'] })
  @IsActiveUser()
  @ResolveField()
  async deleteCourse(
    @Args('id') id: string,
    @Context() { req }: DynamicObject
  ) {
    const token = this.courseService.getTokenFromHttpHeader(req.headers)
    const course = await this.courseService.findById(
      id,
      { relations: { tags: true } },
      { token, strictResourceName: 'course' }
    )

    if (course.filePath) {
      this.gcStorageService.deleteFile(course.filePath)
    }

    await this.courseService.removeCourseFormTag(id, _.map(course.tags, 'id'))

    await this.courseService.deleteOneById(id)

    return true
  }

  private async processImage(
    existedCourse: Course,
    image: Promise<FileUploadType>
  ) {
    if (existedCourse?.filePath) {
      this.gcStorageService.deleteFile(existedCourse.filePath)
    }

    const { filename, createReadStream } = await image
    const readStream = createReadStream()

    const result = await this.gcStorageService.uploadFile({
      fileName: filename,
      readStream,
      type: StorageFolder.course,
      makePublic: true,
      imageProcessConfig: {
        resize: {
          width: 1200,
        },
      },
    })

    return result
  }
}
