import { BaseService } from 'src/common/services/base.service';
import { TestCase } from 'src/assignment/entities/Testcase.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TestCaseSetInput } from 'src/graphql';
import { AssignmentService } from './assignment.service';
import * as _ from 'lodash';

export class TestCaseService extends BaseService<TestCase> {
  constructor(
    @InjectRepository(TestCase)
    private testCaseRepo: Repository<TestCase>,
    private assignmentService: AssignmentService,
  ) {
    super(testCaseRepo, 'TestCase');
  }

  async createTestCase(data: TestCaseSetInput) {
    const assignment = await this.assignmentService.findById(data.assignmentId);

    const tc = this.testCaseRepo.create({
      ...data,
      assignment,
    });

    return this.testCaseRepo.save(tc);
  }

  async updateTestCase(id: string, data: TestCaseSetInput) {
    const existedTc = await this.findById(id);
    const assignment = await this.assignmentService.findById(data.assignmentId);

    _.forOwn(data, (value, key: keyof TestCaseSetInput) => {
      if (key === 'assignmentId') {
        existedTc.assignment = assignment;
      } else {
        value && (existedTc[key] = value);
      }
    });

    return this.testCaseRepo.save(existedTc);
  }
}
