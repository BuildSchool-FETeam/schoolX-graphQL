import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { BaseService } from 'src/common/services/base.service';
import { LessonSetInput } from 'src/graphql';
import { Repository } from 'typeorm';
import { Lesson } from '../entities/Lesson.entity';
import { CourseService } from './course.service';

@Injectable()
export class LessonService extends BaseService<Lesson> {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepo: Repository<Lesson>,
    private courseService: CourseService,
  ) {
    super(lessonRepo, 'Lesson');
  }

  async createLesson({ title, videoUrl, courseId, content }: LessonSetInput) {
    const course = await this.courseService.findById(courseId);
    const lesson = this.lessonRepo.create({
      title,
      videoUrl,
      content,
      course,
      votes: 0,
    });
    return this.lessonRepo.save(lesson);
  }

  async updateLesson(id: string, data: LessonSetInput) {
    const lesson = await this.findById(id);
    const course = await this.courseService.findById(data.courseId);

    _.forOwn(data, (value, key) => {
      if (key !== 'courseId') {
        value && (lesson[key] = value);
      } else {
        lesson.course = course;
      }
    });

    return this.lessonRepo.save(lesson);
  }

  countingLessonWithCourseId(courseId: string) {
    return this.lessonRepo
      .createQueryBuilder('lesson')
      .where('lesson.courseId = :courseId', { courseId })
      .getCount();
  }
}
