import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from 'src/courses/Course.module';
import { Assignment } from 'src/assignment/entities/Assignment.entity';
import { AssignmentService } from './services/assignment.service';
import { AssignmentTypeResolver } from './resolvers/assignmentType.resolver';
import { TestCase } from 'src/assignment/entities/codeChallenge/Testcase.entity';
import { TestCaseService } from './services/codeChallenge/testCase.service';
import { TestCaseMutationResolver } from './resolvers/testCase/testCaseMutation.resolver';
import { TestCaseType } from 'src/graphql';
import { TestCaseQueryResolver } from './resolvers/testCase/testCaseQuery.resolver';
import { MiniServerModule } from 'src/mini-server/mini-server.module';
import { CommonModule } from 'src/common/Common.module';
import { CodeChallengeService } from './services/codeChallenge/codeChallenge.service';
import { CodeChallenge } from './entities/codeChallenge/CodeChallenge.entity';
import { CodeChallengeTypeResolver } from './resolvers/codeChallengeType.resolver';
import { QuizService } from './services/quiz/quiz.service';
import { QuizTypeResolver } from './resolvers/quiz/quizType.resolver';
import { Quiz } from './entities/quiz/Quiz.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assignment, TestCase, CodeChallenge, Quiz]),
    forwardRef(() => CourseModule),
    MiniServerModule,
    CommonModule,
  ],
  providers: [
    AssignmentService,
    AssignmentTypeResolver,
    TestCaseService,
    TestCaseMutationResolver,
    TestCaseType,
    TestCaseQueryResolver,
    CodeChallengeService,
    CodeChallengeTypeResolver,
    QuizService,
    QuizTypeResolver
  ],
  exports: [AssignmentService],
})
export class AssignmentModule {}
