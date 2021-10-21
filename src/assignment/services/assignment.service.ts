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
      hints: data.hints.join('|'),
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
      } else if (['hints'].includes(key)) {
        assignment[key] = (value as string[]).join('|');
      } else {
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
    const checkAvailable = _.some(codeChallenges ,['id', id]);

    if(!checkAvailable) {
      return false;
    }else {
      Promise.all([
        _.remove(codeChallenges, ['id', id]),
        this.codeChallengeService.deleteOneById(id)
      ])
    }

    assignment.codeChallenges = codeChallenges;
    await this.assignmentRepo.save(assignment);
    
    return true;
  }

  // private mappingExpectResultPromises(
  //   testCaseWillBeEvaluated: TestCase[],
  //   miniServerService: IMiniServerService,
  // ) {
  //   return _.map(testCaseWillBeEvaluated, (tc) => {
  //     const { expectResult, generatedExpectResultScript } = tc;

  //     if (expectResult) {
  //       return this.createExpectResultPromise(expectResult);
  //     } else if (generatedExpectResultScript) {
  //       return miniServerService.runCode(generatedExpectResultScript);
  //     }
  //   });
  // }

  // private evaluateTestCaseResult(
  //   resultFromTests: TestResponse[],
  //   expectResult: TestResponse[],
  //   evaluatingTestCases: TestCase[],
  // ) {
  //   const listEvaluation: EvaluationResult[] = [];

  //   _.each(resultFromTests, (resultTest, i) => {
  //     const message: string[] = [];
  //     if (resultTest.status === 'error') {
  //       listEvaluation.push({
  //         testResult: false,
  //         testCaseId: evaluatingTestCases[i].id,
  //         title: evaluatingTestCases[i].title,
  //         executeTime: resultTest.executeTime,
  //         message: resultTest.result,
  //       });

  //       return;
  //     }

  //     const { errors, compareResult } = this.compareExpectAndTestResult(
  //       resultTest.result,
  //       expectResult[i].result,
  //     );
  //     let evaluationResult = compareResult;

  //     !compareResult &&
  //       message.push(`Expect "${errors[1]}" but got "${errors[0]}"`);

  //     if (evaluatingTestCases[i].timeEvaluation) {
  //       const timeCompareResult =
  //         resultTest.executeTime < evaluatingTestCases[i].timeEvaluation;

  //       evaluationResult = evaluationResult && timeCompareResult;
  //       !timeCompareResult &&
  //         message.push(
  //           `Expect the function run in ${evaluatingTestCases[i].timeEvaluation} miliseconds
  //            but yours runs in ${resultTest.executeTime} miliseconds`,
  //         );
  //     }

  //     listEvaluation.push({
  //       testResult: evaluationResult,
  //       testCaseId: evaluatingTestCases[i].id,
  //       title: evaluatingTestCases[i].title,
  //       executeTime: resultTest.executeTime,
  //       message,
  //     });
  //   });

  //   return listEvaluation;
  // }

  // private compareExpectAndTestResult(
  //   testResults: string[],
  //   expectedResult: string[],
  // ) {
  //   let error: [TestResult, ExpectResult] = ['', ''];
  //   const test = _.every(testResults, (result, i) => {
  //     if (result !== expectedResult[i]) {
  //       error = [result, expectedResult[i]];
  //     }
  //     return result === expectedResult[i];
  //   });

  //   return {
  //     compareResult: test,
  //     errors: _.compact(error),
  //   };
  // }

  // private createExpectResultPromise(expectResult: string) {
  //   return new Promise<TestResponse>((resolve) => {
  //     resolve({
  //       executeTime: 0,
  //       status: 'success',
  //       result: [expectResult],
  //     });
  //   });
  // }

  // private getServiceByLanguage(
  //   language: TestCaseProgrammingLanguage,
  // ): IMiniServerService {
  //   switch (language) {
  //     case TestCaseProgrammingLanguage.javascript:
  //       return this.miniJSServerService;
  //     case TestCaseProgrammingLanguage.java:
  //       return this.miniJavaServerService;
  //     case TestCaseProgrammingLanguage.python:
  //       return this.miniPythonServerService
  //   }
  // }
}

// type ExpectResult = string;
// type TestResult = string;

// export interface EvaluationResult {
//   testResult: boolean;
//   testCaseId: string;
//   title: string;
//   executeTime: number;
//   message: string[];
// }
