import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from 'src/courses/Course.module';
import { Assignment } from 'src/assignment/entities/Assignment.entity';
import { TestCase } from 'src/assignment/entities/codeChallenge/Testcase.entity';
import { MiniServerModule } from 'src/mini-server/mini-server.module';
import { CommonModule } from 'src/common/Common.module';
import { ClientUserModule } from 'src/clientUser/clientUser.module';
import { CommentModule } from 'src/comment/comment.module';
import { AssignmentService } from './services/assignment.service';
import { AssignmentTypeResolver } from './resolvers/assignmentType.resolver';
import { TestCaseService } from './services/codeChallenge/testCase.service';
import { TestCaseMutationResolver } from './resolvers/codeChallenge/testCase/testCaseMutation.resolver';
import { TestCaseQueryResolver } from './resolvers/codeChallenge/testCase/testCaseQuery.resolver';
import { CodeChallengeService } from './services/codeChallenge/codeChallenge.service';
import { CodeChallenge } from './entities/codeChallenge/CodeChallenge.entity';
import { CodeChallengeTypeResolver } from './resolvers/codeChallenge/codeChallengeType.resolver';
import { QuizService } from './services/quiz/quiz.service';
import { QuizTypeResolver } from './resolvers/quiz/quizType.resolver';
import { Quiz } from './entities/quiz/Quiz.entity';
import { QuestionTypeResolver } from './resolvers/quiz/questionType.resolver';
import { QuestionService } from './services/quiz/question.service';
import { Question } from './entities/quiz/Question.entity';
import { FileAssignment } from './entities/fileAssignment/fileAssignment.entity';
import { FileAssignmentService } from './services/fileAssignment/fileAssignment.service';
import { FileAssignmentTypeResolver } from './resolvers/fileAssignment/fileAssignmentType.resolver';
import { SubmittedAssignmentService } from './services/fileAssignment/submittedAssignment.service';
import { SubmittedAssignmentTypeResolver } from './resolvers/fileAssignment/submittedAssignmentType.resolver';
import { SubmittedAssignment } from './entities/fileAssignment/SubmittedAssignment.entity';
import { GroupAssignmentService } from './services/fileAssignment/groupAssignment.service';
import { GroupAssignmentTypeResolver } from './resolvers/fileAssignment/groupAssignmentType.resolver';
import { GroupAssignment } from './entities/fileAssignment/groupAssignment.entity';
import { EvaluationComment } from './entities/fileAssignment/evaluationComment.entity';
import { EvaluationCommentService } from './services/fileAssignment/evaluationComment.service';
import { EvaluationCommentTypeResolver } from './resolvers/fileAssignment/evaluationCommentType.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Assignment,
      TestCase,
      CodeChallenge,
      Quiz,
      Question,
      FileAssignment,
      SubmittedAssignment,
      GroupAssignment,
      EvaluationComment,
    ]),
    forwardRef(() => CourseModule),
    MiniServerModule,
    forwardRef(() => CommonModule),
    forwardRef(() => ClientUserModule),
    CommentModule,
  ],
  providers: [
    AssignmentService,
    AssignmentTypeResolver,
    TestCaseService,
    TestCaseMutationResolver,
    TestCaseQueryResolver,
    CodeChallengeService,
    CodeChallengeTypeResolver,
    QuizService,
    QuizTypeResolver,
    QuestionService,
    QuestionTypeResolver,
    FileAssignmentService,
    FileAssignmentTypeResolver,
    SubmittedAssignmentService,
    SubmittedAssignmentTypeResolver,
    GroupAssignmentService,
    GroupAssignmentTypeResolver,
    EvaluationCommentService,
    EvaluationCommentTypeResolver,
  ],
  exports: [AssignmentService, SubmittedAssignmentService],
})
export class AssignmentModule {}
