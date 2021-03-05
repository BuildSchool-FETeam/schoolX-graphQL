import { InstructorService } from './../../instructor/services/instructor.service';
import { NotFoundException } from '@nestjs/common';
import { CourseSetInput } from './../../graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from 'src/courses/entities/Course.entity';
import { BaseService } from 'src/common/services/base.service';
import * as _ from 'lodash';

type CourseDataInput = Omit<CourseSetInput, 'image'> & { imageUrl: string, filePath: string }

export class CourseService extends BaseService<Course> {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
    private instructorService: InstructorService
  ) {
    super(courseRepo)
  }

  async createCourse (data: CourseDataInput) {
    const instructorId = data.instructorId;
    const course = this.courseRepo.create({
      ...data,
      benefits: data.benefits.join('|'),
      requirements: data.requirements.join('|')
    })

    await this.updateInstructorOfCourse(course, instructorId)

    return this.courseRepo.save(course);
  }

  async updateCourse (id: string, data: CourseDataInput) {
    const existedCourse = await this.courseRepo.findOne(id);

    if (!existedCourse) {
      throw new NotFoundException('Course not found')
    }
    _.forOwn(data, (value, key) => {
      typeof value === 'object' && (existedCourse[key] = value.join('|')) ||
        (value && (existedCourse[key] = value))
    })
    this.updateInstructorOfCourse(existedCourse, data.instructorId);

    return this.courseRepo.save(existedCourse);
  }

  private async updateInstructorOfCourse (course: Course, instId: string) {
    const existedOne = await this.instructorService.findById(instId);
    course.instructor = existedOne;
  }
}