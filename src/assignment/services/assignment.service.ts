import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { LessonService } from 'src/courses/services/lesson.service';
import { CodeChallengeSetInput, CodeConfigInput, QuizSetInput, TypeAssign } from 'src/graphql';
import { Code, Repository } from 'typeorm';
import * as _ from 'lodash';
import { Assignment } from 'src/assignment/entities/Assignment.entity';
import { CodeChallengeService } from './codeChallenge/codeChallenge.service';
import { QuizService } from './quiz/quiz.service';
import e from 'cors';
import { CodeChallenge } from '../entities/codeChallenge/CodeChallenge.entity';
import { Quiz } from '../entities/quiz/Quiz.entity';

@Injectable()
export class AssignmentService extends BaseService<Assignment> {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,
    @Inject(forwardRef(() => LessonService))
    private lessonService: LessonService,
    private codeChallengeService: CodeChallengeService,
    private quizService: QuizService
  ) {
    super(assignmentRepo, 'Assignment');
  }

  async getTypeAssign(id, idAssign) {
    const assignment = await this.findById(id,
     {relations: ["codeChallenges", "quizs"]}  
    )
    const codeChallenges = _.some(assignment.codeChallenges, ['id', parseInt(idAssign)]);
    const quizs = _.some(assignment.quizs, ['id', parseInt(idAssign)]);

    if(codeChallenges) { return TypeAssign.codeChallenge }
    if(quizs) { return TypeAssign.quiz }

    throw new NotFoundException(`Assignment with id ${idAssign} is not exist`);
  } 

  async createAssignment(lessonId: string) {
    const lesson = await this.lessonService.findById(lessonId);
    const assignment = this.assignmentRepo.create({
      lesson
    });

    return this.assignmentRepo.save(assignment);
  }

  /**
   * -------------------------
   * Code Challenge Service
   * -------------------------
  */
  async runTestCase(challengeId: string, data: CodeConfigInput) {
    return this.codeChallengeService.runTestCase(challengeId, data);
  }

  async getCodeChallenge(id: string) {
    return this.codeChallengeService.findById(id);
  }

  async setCodeChallenge(id: string, data: CodeChallengeSetInput) {
    if(!id) {
      return this.codeChallengeService.create(data);
    }else{
      return this.codeChallengeService.update(id, data);
    }
  }

  async deleteCodeChallenge(id: string){
    return this.codeChallengeService.delete(id)
  }
  /**
   * -----------------------------
   * Code Challenge Service end 
   * -----------------------------
  */

  /**
   * ---------------
   * Quiz Service
   * ---------------
  */
  async getQuiz(id: string) {
    return this.quizService.findById(id)
  }

  async setQuiz(id: string, data: QuizSetInput) {
    if(!id) {
      return this.quizService.create(data);
    }else{
      return this.quizService.update(id, data);
    }
  }

  async deleteQuiz(id: string) {
    return this.quizService.delete(id);
  }
  /**
   * -------------------
   * Quiz Service end
   * -------------------
  */

  async deleteAssgin(id: string) {
    const {codeChallenges, quizs} = await this.findById(id, {
      relations: ["codeChallenges", "quizs"]
    })

    if(
      codeChallenges.length === 0 &&
      quizs.length === 0
    ) { 
      this.deleteOneById(id);
    }
  }
}