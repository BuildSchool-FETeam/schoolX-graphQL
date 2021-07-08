import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { LessonService } from 'src/courses/services/lesson.service';
import { AssignmentSetInput, CodeConfigInput } from 'src/graphql';
import { Repository } from 'typeorm';
import * as _ from 'lodash';
import { Assignment } from 'src/assignment/entities/Assignment.entity';
import { JSMiniServerService } from 'src/mini-server/services/JSMiniServer.service';
import {
  TestCase,
  TestCaseProgrammingLanguage,
} from '../entities/Testcase.entity';
import {
  IMiniServerService,
  TestResponse,
} from 'src/mini-server/services/base/miniServer.interface';
import { JavaMiniServerService } from 'src/mini-server/services/JavaMiniServer.service';

@Injectable()
export class AssignmentService extends BaseService<Assignment> {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,
    private lessonService: LessonService,
    private miniJSServerService: JSMiniServerService,
    private miniJavaServerService: JavaMiniServerService,
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

  async runCode(code: string, language: TestCaseProgrammingLanguage) {
    const serverService = this.getServiceByLanguage(language);
    const { result, status, executeTime } = await serverService.runCode(code);

    return {
      status: status,
      result: result,
      executeTime: executeTime,
    };
  }

  async runTestCase(assignmentId: string, data: CodeConfigInput) {
    const existedAssignment = await this.findById(assignmentId, {
      relations: ['testCases'],
      select: ['id'],
    });
    const miniServerService = this.getServiceByLanguage(
      TestCaseProgrammingLanguage[data.language],
    );
    const testCaseWillBeEvaluated = _.filter(
      existedAssignment.testCases,
      (tc) => tc.programingLanguage === data.language,
    );

    const runningTestResultPromises = _.map(testCaseWillBeEvaluated, (tc) => {
      return miniServerService.runCodeWithTestCase(data.code, {
        runningTestScript: tc.runningTestScript,
      });
    });

    const runningExpectScriptPromises = this.mappingExpectResultPromises(
      testCaseWillBeEvaluated,
      miniServerService,
    );

    const [runningTestResult, runningExpectScript] = [
      await Promise.all(runningTestResultPromises),
      await Promise.all(runningExpectScriptPromises),
    ];

    const evaluatedResults = this.evaluateTestCaseResult(
      runningTestResult,
      runningExpectScript,
      testCaseWillBeEvaluated,
    );
    const summaryEvaluation = _.every(
      evaluatedResults,
      (item) => item.testResult,
    );

    return {
      summaryEvaluation,
      testCaseEvaluations: evaluatedResults,
    };
  }

  private mappingExpectResultPromises(
    testCaseWillBeEvaluated: TestCase[],
    miniServerService: IMiniServerService,
  ) {
    return _.map(testCaseWillBeEvaluated, (tc) => {
      const { expectResult, generatedExpectResultScript } = tc;

      if (expectResult) {
        return this.createExpectResultPromise(expectResult);
      } else if (generatedExpectResultScript) {
        return miniServerService.runCode(generatedExpectResultScript);
      }
    });
  }

  private evaluateTestCaseResult(
    resultFromTests: TestResponse[],
    expectResult: TestResponse[],
    evaluatingTestCases: TestCase[],
  ) {
    const listEvaluation: EvaluationResult[] = [];

    _.each(resultFromTests, (resultTest, i) => {
      const message: string[] = [];
      if (resultTest.status === 'error') {
        listEvaluation.push({
          testResult: false,
          testCaseId: evaluatingTestCases[i].id,
          title: evaluatingTestCases[i].title,
          executeTime: resultTest.executeTime,
          message: resultTest.result,
        });

        return;
      }

      const { errors, compareResult } = this.compareExpectAndTestResult(
        resultTest.result,
        expectResult[i].result,
      );
      let evaluationResult = compareResult;

      !compareResult &&
        message.push(`Expect "${errors[1]}" but got "${errors[0]}"`);

      if (evaluatingTestCases[i].timeEvaluation) {
        const timeCompareResult =
          resultTest.executeTime < evaluatingTestCases[i].timeEvaluation;

        evaluationResult = evaluationResult && timeCompareResult;
        !timeCompareResult &&
          message.push(
            `Expect the function run in ${evaluatingTestCases[i].timeEvaluation} miliseconds
             but yours runs in ${resultTest.executeTime} miliseconds`,
          );
      }

      listEvaluation.push({
        testResult: evaluationResult,
        testCaseId: evaluatingTestCases[i].id,
        title: evaluatingTestCases[i].title,
        executeTime: resultTest.executeTime,
        message,
      });
    });

    return listEvaluation;
  }

  private compareExpectAndTestResult(
    testResults: string[],
    expectedResult: string[],
  ) {
    let error: [TestResult, ExpectResult] = ['', ''];
    const test = _.every(testResults, (result, i) => {
      if (result !== expectedResult[i]) {
        error = [result, expectedResult[i]];
      }
      return result === expectedResult[i];
    });

    return {
      compareResult: test,
      errors: _.compact(error),
    };
  }

  private createExpectResultPromise(expectResult: string) {
    return new Promise<TestResponse>((resolve) => {
      resolve({
        executeTime: 0,
        status: 'success',
        result: [expectResult],
      });
    });
  }

  private getServiceByLanguage(
    language: TestCaseProgrammingLanguage,
  ): IMiniServerService {
    switch (language) {
      case TestCaseProgrammingLanguage.javascript:
        return this.miniJSServerService;
      case TestCaseProgrammingLanguage.java:
        return this.miniJavaServerService;
    }
  }
}

type ExpectResult = string;
type TestResult = string;

export interface EvaluationResult {
  testResult: boolean;
  testCaseId: string;
  title: string;
  executeTime: number;
  message: string[];
}
