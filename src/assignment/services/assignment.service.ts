import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
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

    const [codeChallenge, quizs] = await Promise.all([
      _.some(assignment.codeChallenges, ['id', parseInt(idAssign)]),
      _.some(assignment.quizs, ['id', parseInt(idAssign)])
    ])

    console.log(codeChallenge, quizs);

    if(codeChallenge) { return TypeAssign.codeChallenge }
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

  async createCodeChallenge(data: CodeChallengeSetInput) {
    const lesson = await this.lessonService.findById(data.lessonId, {relations: ["assignment"]})
 
    let assignment: Assignment;

    if(!lesson.assignment) {
      assignment = await this.createAssignment(data.lessonId);
      assignment.codeChallenges = [];
    }else {
      assignment = await this.findById(lesson.assignment.id, {relations: ["codeChallenges"]})
    }

    const codeChallenges = _.cloneDeep(assignment.codeChallenges);
    const challenge = await this.codeChallengeService.createChallenge(data, assignment);
    
    codeChallenges.push(challenge);
    assignment.codeChallenges = codeChallenges;
    this.assignmentRepo.save(assignment);

    return challenge; 
  }

  async updateCodeChallenge(id: string, data: CodeChallengeSetInput) {
    const lesson = await this.lessonService.findById(data.lessonId, {relations: ["assignment"]});
    let assignment: Assignment;
    let codeChallenge: CodeChallenge;

    if(!lesson.assignment) {
      assignment = await this.createAssignment(data.lessonId);
      assignment.codeChallenges = []

      codeChallenge = await this.codeChallengeService.updateChallenge(id, data, assignment);
    }else {
      assignment = await this.findById(lesson.assignment.id, {relations: ["codeChallenges", "lesson"]});

      if(assignment.lesson.id.toString() === data.lessonId.toString()){
        codeChallenge = await this.codeChallengeService.updateChallenge(id, data);
      }else {
        codeChallenge = await this.codeChallengeService.updateChallenge(id, data, assignment);
      }
    }

    const codeChallenges = _.cloneDeep(assignment.codeChallenges);
    codeChallenges.push(codeChallenge)
    assignment.codeChallenges = codeChallenges;
    this.assignmentRepo.save(assignment);

    return codeChallenge;
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

  async createQuiz(data: QuizSetInput) {
    const { assignment } = await this.lessonService.findById(data.lessonId, {relations: ["assignment"]});
    
    let assign: Assignment;
    if(!assignment) {
      assign = await this.createAssignment(data.lessonId);
      assign.quizs = []
    }else{
      assign = await this.findById(assignment.id, {relations: ["quizs"]});
    }

    const quizs = _.cloneDeep(assignment.quizs);
    const quiz = await this.quizService.createQuiz(data, assign);

    quizs.push(quiz);
    assign.quizs = quizs;
    this.assignmentRepo.save(assign);

    return quiz; 
  }

  async updateQuiz(id: string, data: QuizSetInput) {
    const lesson = await this.lessonService.findById(data.lessonId, {relations: ["assignment"]});
    let assignment: Assignment;
    let quiz: Quiz;

    if(!lesson.assignment) {
      assignment = await this.createAssignment(data.lessonId);
      assignment.codeChallenges = []

      quiz = await this.quizService.updateQuiz(id, data, assignment);
    }else {
      assignment = await this.findById(lesson.assignment.id, {relations: ["quizs", "lesson"]});

      if(assignment.lesson.id.toString() === data.lessonId.toString()){
        quiz = await this.quizService.updateQuiz(id, data);
      }else {
        quiz = await this.quizService.updateQuiz(id, data, assignment);
      }
    }

    const quizs = _.cloneDeep(assignment.quizs);
    quizs.push(quiz)
    assignment.quizs = quizs;
    this.assignmentRepo.save(assignment);

    return quiz;
  }

  async deleteQuiz(id: string) {
    const quiz = await this.quizService.findById(id, {
      relations: ["assignment"]
    });
    const assignment = await this.findById(quiz.assignment.id, {
      relations: ["quizs"]
    })

    const quizs = _.cloneDeep(assignment.quizs);
    const [checkAvailable, isRemoveAssign] = await Promise.all([
      _.some(quizs ,['id', id]),
      this.checkRemoveAssgin(quiz.assignment.id)
    ])

    if(!checkAvailable) {
      return false;
    }else if(isRemoveAssign){
      Promise.all([
        _.remove(quizs, ['id', id]),
        this.quizService.deleteOneById(id),
        this.deleteOneById(quiz.assignment.id)
      ])
    }else {
      Promise.all([
        _.remove(quizs, ['id', id]),
        this.quizService.deleteOneById(id),
      ])
    }

    assignment.quizs = quizs;
    await this.assignmentRepo.save(assignment);
    
    return true;
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