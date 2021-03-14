import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { LessonService } from 'src/courses/services/lesson.service';
import { AssignmentSetInput } from 'src/graphql';
import { Repository } from 'typeorm';
import * as _ from 'lodash';
import { Assignment } from 'src/Assignment/entities/Assignment.entity';

@Injectable()
export class AssignmentService extends BaseService<Assignment> {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,
    private lessonService: LessonService,
  ) {
    super(assignmentRepo, 'Assignment');
  }

  async createAssignment(data: AssignmentSetInput) {
    const lesson = await this.lessonService.findById(data.lessonId);
    const assignment = this.assignmentRepo.create({
      ...data,
      hints: data.hints.join('|'),
      languageSupport: data.languageSupport.join('|'),
      lesson,
    });

    return this.assignmentRepo.save(assignment);
  }

  async updateAssignment(id: string, data: AssignmentSetInput) {
    const assignment = await this.findById(id);
    const lesson = await this.lessonService.findById(data.lessonId);

    _.forOwn(data, (value, key) => {
      if (key === 'lessonId') {
        assignment.lesson = lesson;
      } else if (['hints', 'languageSupport'].includes(key)) {
        assignment[key] = (value as string[]).join('|');
      } else {
        value && (assignment[key] = value);
      }
    });

    return this.assignmentRepo.save(assignment);
  }
}
