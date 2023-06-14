import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Course } from 'src/courses/entities/Course.entity'
import { BaseService, IStrictConfig } from 'src/common/services/base.service'
import * as _ from 'lodash'
import { TagService } from 'src/tag/tag.service'
import { AdminUser } from 'src/adminUser/AdminUser.entity'
import { ActionCourse, CourseSetInput } from 'src/graphql'
import { ClientUser } from 'src/clientUser/entities/ClientUser.entity'
import { CacheService } from '../../common/services/cache.service'
import { ACTION_PERM } from 'src/common/constants/permission.constant'

type CourseDataInput = Omit<CourseSetInput, 'image'> & {
  imageUrl: string
  filePath: string
  createdBy: AdminUser | ClientUser
  levels: string[]
}

@Injectable()
export class CourseService extends BaseService<Course> {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
    private tagService: TagService,
    private cachedService: CacheService
  ) {
    super(courseRepo, 'Course', cachedService)
  }

  async createCourse(data: CourseDataInput) {
    const course = this.courseRepo.create({
      ...data,
      benefits: data.benefits.join('|'),
      requirements: data.requirements.join('|'),
      tags: [],
      levels: data.levels.join('|'),
    })

    const tagsString = data.tags
    const tagsPromise = this.createTags(tagsString)

    return Promise.all(tagsPromise)
      .then((tags) => {
        course.tags = tags
      })
      .then(async () => {
        return this.courseRepo.save(course)
      })
  }

  async updateCourse(
    id: string,
    data: CourseDataInput,
    strictConfig: IStrictConfig
  ) {
    const existedCourse = await this.findById(
      id,
      { relations: { createdBy: true } },
      strictConfig
    )

    if (!existedCourse) {
      throw new NotFoundException('Course not found')
    }

    const isHavePerm = await this.isHavePermAction(
      existedCourse,
      strictConfig,
      ACTION_PERM.UPDATE
    )
    if (!isHavePerm) {
      throw new ForbiddenException(
        "You don't have permission to do this action on resource"
      )
    }
    _.omit(data, 'createdBy')
    _.forOwn(data, (value, key) => {
      if (_.isArray(value)) {
        existedCourse[key] = value.join('|')
      } else {
        value && (existedCourse[key] = value)
      }
    })

    const tagsPromise = this.createTags(data.tags)
    const tags = await Promise.all(tagsPromise)

    existedCourse.tags = tags

    return this.courseRepo.save(existedCourse)
  }

  async updateJoinedUsers(id: string, user: ClientUser, action: ActionCourse) {
    const course = await this.findById(id, { relations: { joinedUsers: true } })
    const users: ClientUser[] = _.cloneDeep(course.joinedUsers)

    if (action === ActionCourse.JOIN) {
      users.push(user)
    } else {
      _.remove(users, (oldUser) => oldUser.id === user.id)
    }

    course.joinedUsers = users
    this.courseRepo.save(course)

    return true
  }

  async updateCompletedUser(id: string, user: ClientUser) {
    const course = await this.findById(id, {
      relations: { completedUser: true },
    })
    const users: ClientUser[] = _.cloneDeep(course.completedUser)

    users.push(user)

    course.completedUser = users
    this.courseRepo.save(course)

    return true
  }

  async removeCourse(course: Course) {
    await this.removeCourseFormTag(course.id, _.map(course.tags, 'id'))

    return this.repository.delete(course.id)
  }

  async removeCourseFormTag(removedCourseId: string, tagIds: string[]) {
    const promises: Array<Promise<DynamicObject>> = []

    _.each(tagIds, (tagId) => {
      promises.push(this.tagService.removeCourseFromTag(tagId, removedCourseId))
    })

    return Promise.all(promises)
  }

  private createTags(tags: string[]) {
    return _.map(tags, async (tag) =>
      this.tagService.addTag({
        title: tag,
      })
    )
  }
}
