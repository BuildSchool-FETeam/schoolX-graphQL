import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Assignment } from 'src/assignment/entities/Assignment.entity';
import { CodeChallenge } from 'src/assignment/entities/codeChallenge/CodeChallenge.entity';
import { Quiz } from 'src/assignment/entities/quiz/Quiz.entity';
import { AssignmentService } from 'src/assignment/services/assignment.service';
import { BaseService } from 'src/common/services/base.service';
import { CodeChallengeSetInput, CodeConfigInput, LessonSetInput, QuizSetInput } from 'src/graphql';
import { Repository } from 'typeorm';
import { Lesson } from '../entities/Lesson.entity';
import { CourseService } from './course.service';

@Injectable()
export class LessonService extends BaseService<Lesson> {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepo: Repository<Lesson>,
    private courseService: CourseService,
    private assignService: AssignmentService,
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

  async getTypeAssignment(id: string, idAssign: string) {
    const lesson = await this.findById(id, 
      {relations: ["assignment"]}  
    )

    return this.assignService.getTypeAssign(lesson.assignment.id, idAssign);
  }

  async getCodeChallenge(id: string) {
    return this.assignService.getCodeChallenge(id);
  }

  async runTestCase(challengeId: string, data: CodeConfigInput) {
    return this.assignService.runTestCase(challengeId, data);
  }

  async setCodeChallenge(
    id: string,
    data: CodeChallengeSetInput,
  ) {

    return this.assignService.setCodeChallenge(id, data);
  }

  async deleteCodeChallenge(
    id: string
  ){
    return this.assignService.deleteCodeChallenge(id);
  }

  async getQuiz(id: string) {
    return this.assignService.getQuiz(id);
  }

  async setQuiz(
    id: string,
    data: QuizSetInput
  ){
    return this.assignService.setQuiz(id, data);
  }

  async deleteQuiz(
    id: string
  ) {
    return this.assignService.deleteQuiz(id);
  }
}
