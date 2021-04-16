import { CacheService } from './../../common/services/cache.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from 'src/courses/entities/Course.entity';
import { BaseService, IStrictConfig } from 'src/common/services/base.service';
import * as _ from 'lodash';
import { TagService } from 'src/tag/tag.service';
import { AdminUser } from 'src/adminUser/AdminUser.entity';
import { CourseSetInput } from 'src/graphql';
import { InstructorService } from 'src/instructor/services/instructor.service';

type CourseDataInput = Omit<CourseSetInput, 'image'> & {
  imageUrl: string;
  filePath: string;
  createdBy: AdminUser;
  levels: string[];
};

@Injectable()
export class CourseService extends BaseService<Course> {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
    private instructorService: InstructorService,
    private tagService: TagService,
    private cachedService: CacheService,
  ) {
    super(courseRepo, 'Course', cachedService);
  }

  async createCourse(data: CourseDataInput) {
    const instructorId = data.instructorId;

    const course = this.courseRepo.create({
      ...data,
      benefits: data.benefits.join('|'),
      requirements: data.requirements.join('|'),
      tags: [],
      levels: data.levels.join('|'),
    });

    const tagsString = data.tags;
    const tagsPromise = this.createTags(tagsString);

    return Promise.all(tagsPromise)
      .then((tags) => {
        course.tags = tags;
      })
      .then(async () => {
        await this.updateCourseInstructor(course, instructorId);

        return this.courseRepo.save(course);
      });
  }

  async updateCourse(
    id: string,
    data: CourseDataInput,
    strictConfig: IStrictConfig,
  ) {
    const existedCourse = await this.findById(id, {}, strictConfig);

    if (!existedCourse) {
      throw new NotFoundException('Course not found');
    }
    _.forOwn(data, (value, key: keyof CourseDataInput) => {
      if (value instanceof Array) {
        existedCourse[key] = value.join('|');
      } else {
        value && (existedCourse[key] = value);
      }
    });
    const tagsString = data.tags;
    const tagsPromise = this.createTags(tagsString);

    return Promise.all(tagsPromise)
      .then((tags) => {
        existedCourse.tags = tags;
      })
      .then(async () => {
        await this.updateCourseInstructor(existedCourse, data.instructorId);

        return this.courseRepo.save(existedCourse);
      });
  }

  private createTags(tags: string[]) {
    return _.map(tags, (tag) => {
      return this.tagService.addTag({
        title: tag,
      });
    });
  }

  private async updateCourseInstructor(course: Course, instId: string) {
    const existedOne = await this.instructorService.findById(instId);
    course.instructor = existedOne;
  }
}
