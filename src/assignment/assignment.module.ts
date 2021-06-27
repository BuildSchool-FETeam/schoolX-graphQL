import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from 'src/courses/Course.module';
import { Assignment } from 'src/assignment/entities/Assignment.entity';
import { AssignmentService } from './services/assignment.service';
import { AssignmentMutationResolver } from './resolvers/assignment/assignmentMutation.resolver';
import { AssignmentQueryResolver } from './resolvers/assignment/assignmentQuery.resolver';
import { AssignmentTypeResolver } from './resolvers/assignment/assignmentType.resolver';
import { TestCase } from 'src/assignment/entities/Testcase.entity';
import { TestCaseService } from './services/testCase.service';
import { TestCaseMutationResolver } from './resolvers/testCase/testCaseMutation.resolver';
import { TestCaseType } from 'src/graphql';
import { TestCaseQueryResolver } from './resolvers/testCase/testCaseQuery.resolver';
import { MiniServerModule } from 'src/mini-server/mini-server.module';
import { CommonModule } from 'src/common/Common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assignment, TestCase]),
    CourseModule,
    MiniServerModule,
    CommonModule,
  ],
  providers: [
    AssignmentService,
    AssignmentMutationResolver,
    AssignmentTypeResolver,
    AssignmentQueryResolver,
    TestCaseService,
    TestCaseMutationResolver,
    TestCaseType,
    TestCaseQueryResolver,
  ],
})
export class AssignmentModule {}
