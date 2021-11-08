import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { LessonService } from 'src/courses/services/lesson.service';
import { CodeChallengeSetInput, CodeConfigInput, TypeAssign } from 'src/graphql';
import { Repository } from 'typeorm';
import * as _ from 'lodash';
import { Assignment } from 'src/assignment/entities/Assignment.entity';
import { CodeChallengeService } from './codeChallenge/codeChallenge.service';
import { QuizService } from './quiz/quiz.service';

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

    const [codeChallenge, quizs] = await Promise.all([
      _.some(assignment.codeChallenges, ['id', idAssign]),
      _.some(assignment.quizs, ['id', idAssign])
    ])

    if(codeChallenge) { return TypeAssign.codeChallenge }
    if(quizs) { return TypeAssign.quiz }

    throw new NotFoundException(`Assignment with id ${idAssign} is not exist`);
  } 

  async createAssignment(lessonId: string,) {
    const lesson = await this.lessonService.findById(lessonId);
    const assignment = this.assignmentRepo.create({
      // ...data,
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

  async createCodeChallenge(data: CodeChallengeSetInput) {
    const lesson = await this.lessonService.findById(data.lessonId, {relations: ["assignment"]})
 
    let assignment: Assignment;

    if(!data.lessonId || !lesson.assignment) {
      assignment = await this.createAssignment(data.lessonId);
      assignment.codeChallenges = [];
    }else {
      assignment = await this.findById(lesson.assignment.id, {relations: ["codeChallenges"]})
    }

    const codeChallenges = _.cloneDeep(assignment.codeChallenges);
    const challenge = await this.codeChallengeService.createChallenge(data, assignment);
    
    codeChallenges.push(challenge);
    assignment.codeChallenges = codeChallenges;

    return this.assignmentRepo.save(assignment);
  }

  async updateCodeChallenge(idChallenge: string, data: CodeChallengeSetInput) {

    let assignment: Assignment;

    if(!data.lessonId) {
      this.codeChallengeService.updateChallenge(idChallenge, data);
    }else{
      const lesson = await this.lessonService.findById(data.lessonId, {relations: ["assignment"]});

      assignment = await this.findById(lesson.assignment.id);
      this.codeChallengeService.updateChallenge(idChallenge, data, assignment);
    }
    return assignment
  }

  async deleteCodeChallenge(id: string){
    const codeChallenge = await this.codeChallengeService.findById(id, {
      relations: ["assignment"]
    });
    const assignment = await this.findById(codeChallenge.assignment.id, {
      relations: ["codeChallenges"]
    })

    const codeChallenges = _.cloneDeep(assignment.codeChallenges);
    const [checkAvailable, isRemoveAssign] = await Promise.all([
      _.some(codeChallenges ,['id', id]),
      this.checkRemoveAssgin(codeChallenge.assignment.id)
    ])

    if(!checkAvailable) {
      return false;
    }else if(isRemoveAssign){
      Promise.all([
        _.remove(codeChallenges, ['id', id]),
        this.codeChallengeService.deleteOneById(id),
        this.deleteOneById(codeChallenge.assignment.id)
      ])
    }else {
      Promise.all([
        _.remove(codeChallenges, ['id', id]),
        this.codeChallengeService.deleteOneById(id),
      ])
    }

    assignment.codeChallenges = codeChallenges;
    await this.assignmentRepo.save(assignment);
    
    return true;
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

  async createQuiz() {

  }

  async updateQuiz() {

  }

  async deleteQuiz() {

  }
  /**
   * -------------------
   * Quiz Service end
   * -------------------
  */

  private async checkRemoveAssgin(id: string) {
    const {codeChallenges} = await this.findById(id, {
      relations: ["codeChallenges"]
    })

    if(
      codeChallenges.length === 0
    ) { return true }

    return false;
  }
}