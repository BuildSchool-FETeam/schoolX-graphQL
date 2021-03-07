import { InstructorService } from './../../instructor/services/instructor.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseSetInput } from './../../graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from 'src/courses/entities/Course.entity';
import { BaseService } from 'src/common/services/base.service';
import * as _ from 'lodash';
import { TagService } from 'src/tag/tag.service';

type CourseDataInput = Omit<CourseSetInput, 'image'> & {
  imageUrl: string;
  filePath: string;
};

@Injectable()
export class CourseService extends BaseService<Course> {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
    private instructorService: InstructorService,
    private tagService: TagService,
  ) {
    super(courseRepo, 'Course');
  }

  async createCourse(data: CourseDataInput) {
    const instructorId = data.instructorId;

    const course = this.courseRepo.create({
      ...data,
      benefits: data.benefits.join('|'),
      requirements: data.requirements.join('|'),
      tags: [],
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

  async updateCourse(id: string, data: CourseDataInput) {
    const existedCourse = await this.courseRepo.findOne(id);

    if (!existedCourse) {
      throw new NotFoundException('Course not found');
    }
    _.forOwn(data, (value, key) => {
      (typeof value === 'object' && (existedCourse[key] = value.join('|'))) ||
        (value && (existedCourse[key] = value));
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
