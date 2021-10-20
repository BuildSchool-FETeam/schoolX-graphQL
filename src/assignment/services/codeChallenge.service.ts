import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as _ from "lodash";
import { BaseService } from "src/common/services/base.service";
import { CodeChallengeSetInput, CodeConfigInput } from "src/graphql";
import { IMiniServerService, TestResponse } from "src/mini-server/services/base/miniServer.interface";
import { JavaMiniServerService } from "src/mini-server/services/JavaMiniServer.service";
import { JSMiniServerService } from "src/mini-server/services/JSMiniServer.service";
import { PythonMiniServerService } from "src/mini-server/services/PythonMiniServer.service";
import { Repository } from "typeorm";
import { Assignment } from "../entities/Assignment.entity";
import { CodeChallenge } from "../entities/CodeChallenge.entity";
import { TestCase, TestCaseProgrammingLanguage } from "../entities/Testcase.entity";
import { AssignmentService } from "./assignment.service";

@Injectable()
export class CodeChallengeService extends BaseService<CodeChallenge> {
    constructor(
        @InjectRepository(CodeChallenge)
        private codeChallengeRepo: Repository<CodeChallenge>,
        private miniJSServerService: JSMiniServerService,
        private miniJavaServerService: JavaMiniServerService,
        private miniPythonServerService: PythonMiniServerService,
    ){
        super(codeChallengeRepo, "CodeChallenge")
    }

    async createChallenge(data: CodeChallengeSetInput, assignment: Assignment) {
        const codeChallenge = await this.codeChallengeRepo.create({
            ...data,
            languageSupport: data.languageSupport.join("|"),
            assignment
        })

        return this.codeChallengeRepo.save(codeChallenge);
    }

    async updateChallenge(id: string, data: CodeChallengeSetInput, assignment?: Assignment) {
        const challenge = await this.findById(id);

        _.forOwn(data, (value, key) => {
            if('assignmentId' === key && assignment){
                challenge.assignment =  assignment;
            } else if ('languageSupport' === key) {
                challenge[key] = (value as string[]).join('|');
            } else {
                value && (challenge[key] = value);
            }
        });

        return this.codeChallengeRepo.save(challenge);
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

    async runTestCase(challengeId: string, data: CodeConfigInput) {
        const existedChallenge = await this.findById(challengeId, {
            relations: ['testCases'],
            select: ['id'],
        });
        const miniServerService = this.getServiceByLanguage(
            TestCaseProgrammingLanguage[data.language],
        );
        const testCaseWillBeEvaluated = _.filter(
            existedChallenge.testCases,
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
    ){
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
    ){
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
            case TestCaseProgrammingLanguage.python:
                return this.miniPythonServerService
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
  