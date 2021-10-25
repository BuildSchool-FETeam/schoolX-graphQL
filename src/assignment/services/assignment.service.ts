import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { LessonService } from 'src/courses/services/lesson.service';
import { AssignmentSetInput, CodeChallengeSetInput, CodeConfigInput } from 'src/graphql';
import { Repository } from 'typeorm';
import * as _ from 'lodash';
import { Assignment } from 'src/assignment/entities/Assignment.entity';
import {
  TestCaseProgrammingLanguage,
} from '../entities/Testcase.entity';
import { CodeChallengeService } from './codeChallenge.service';

@Injectable()
export class AssignmentService extends BaseService<Assignment> {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,
    private lessonService: LessonService,
    private codeChallengeService: CodeChallengeService,
  ) {
    super(assignmentRepo, 'Assignment');
  }

  async createAssignment(data: AssignmentSetInput) {
    const lesson = await this.lessonService.findById(data.lessonId);
    const assignment = this.assignmentRepo.create({
      ...data,
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
      }else {
        value && (assignment[key] = value);
      }
    });

    return this.assignmentRepo.save(assignment);
  }

  async runCode(code: string, language: TestCaseProgrammingLanguage) {
    return this.codeChallengeService.runCode(code, language);
  }

  async runTestCase(challengeId: string, data: CodeConfigInput) {
    return this.codeChallengeService.runTestCase(challengeId, data);
  }

  async createCodeChallenge(data: CodeChallengeSetInput, dataAssign: AssignmentSetInput ) {
    let assignment: Assignment;

    if(!data.assignmentId) {
      assignment = await this.createAssignment(dataAssign);
      assignment.codeChallenges = [];
    }else {
      assignment = await this.findById(data.assignmentId, {relations: ["codeChallenges"]})
    }

    const codeChallenges = _.cloneDeep(assignment.codeChallenges);
    const challenge = await this.codeChallengeService.createChallenge(data, assignment);
    
    codeChallenges.push(challenge);
    assignment.codeChallenges = codeChallenges;

    return this.assignmentRepo.save(assignment);
  }

  async updateCodeChallenge(idChallenge: string, data: CodeChallengeSetInput) {

    let assignment: Assignment;

    if(!data.assignmentId) {
      this.codeChallengeService.updateChallenge(idChallenge, data);
    }else{
      assignment = await this.findById(data.assignmentId);
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