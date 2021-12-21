import { BaseService } from 'src/common/services/base.service';
import { TestCase } from 'src/assignment/entities/codeChallenge/Testcase.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TestCaseSetInput } from 'src/graphql';
import * as _ from 'lodash';
import { BadRequestException } from '@nestjs/common';
import { CodeChallengeService } from './codeChallenge.service';

export class TestCaseService extends BaseService<TestCase> {
  constructor(
    @InjectRepository(TestCase)
    private testCaseRepo: Repository<TestCase>,
    private codeChallengeService: CodeChallengeService,
  ) {
    super(testCaseRepo, 'TestCase');
  }

  async createTestCase(data: TestCaseSetInput) {
    const codeChallenge = await this.codeChallengeService.findById(
      data.codeChallengeId,
    );

    if (
      _.isNil(data.generatedExpectResultScript) &&
      _.isNil(data.expectResult)
    ) {
      throw new BadRequestException(
        "You should provide either 'generatedExpectResultScript' OR 'expectResult'",
      );
    }

    const tc = this.testCaseRepo.create({
      title: data.title,
      expectResult: data.expectResult,
      generatedExpectResultScript: data.generatedExpectResultScript,
      runningTestScript: data.runningTestScript,
      programingLanguage: data.programingLanguage,
      timeEvaluation: data.timeEvaluation,
      codeChallenge,
    });

    return this.testCaseRepo.save(tc);
  }

  async updateTestCase(id: string, data: TestCaseSetInput) {
    const existedTc = await this.findById(id);
    const codeChallenge = await this.codeChallengeService.findById(
      data.codeChallengeId,
    );

    _.forOwn(data, (value, key) => {
      if (key === 'codeChallengeId') {
        existedTc.codeChallenge = codeChallenge;
      } else {
        value && (existedTc[key] = value);
      }
    });

    return this.testCaseRepo.save(existedTc);
  }
}
