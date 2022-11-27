import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminUser } from './adminUser/AdminUser.entity'
import { Article } from './article/entities/Article.entity'
import { ArticleTag } from './article/entities/ArticleTag.entity'
import { Assignment } from './assignment/entities/Assignment.entity'
import { CodeChallenge } from './assignment/entities/codeChallenge/CodeChallenge.entity'
import { TestCase } from './assignment/entities/codeChallenge/Testcase.entity'
import { EvaluationComment } from './assignment/entities/fileAssignment/evaluationComment.entity'
import { FileAssignment } from './assignment/entities/fileAssignment/fileAssignment.entity'
import { GroupAssignment } from './assignment/entities/fileAssignment/groupAssignment.entity'
import { SubmittedAssignment } from './assignment/entities/fileAssignment/SubmittedAssignment.entity'
import { Question } from './assignment/entities/quiz/Question.entity'
import { Quiz } from './assignment/entities/quiz/Quiz.entity'
import { Achievement } from './clientUser/entities/Achivement.entity'
import { ClientUser } from './clientUser/entities/ClientUser.entity'
import { UserComment } from './comment/entities/UserComment.entity'
import { Course } from './courses/entities/Course.entity'
import { Lesson } from './courses/entities/Lesson.entity'
import { LessonDocument } from './courses/entities/LessonDocument.entity'
import { Instructor } from './instructor/entities/Instructor.entity'
import { AdminNotification } from './notification/Notification.entity'
import { PermissionSet } from './permission/entities/Permission.entity'
import { Role } from './permission/entities/Role.entity'
import { Tag } from './tag/entities/tag.entity'

console.log(process.env.NODE_ENV)

export const typeORMModuleInit = TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 5432,
  username: process.env.DB_USER_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Toan1234',
  database: process.env.DB_NAME || 'prisdom',
  logging: true,
  entities: [
    AdminUser,
    Instructor,
    Article,
    ArticleTag,
    Assignment,
    CodeChallenge,
    TestCase,
    EvaluationComment,
    FileAssignment,
    GroupAssignment,
    SubmittedAssignment,
    Question,
    Quiz,
    Achievement,
    ClientUser,
    UserComment,
    Course,
    Lesson,
    LessonDocument,
    AdminNotification,
    PermissionSet,
    Role,
    Tag,
  ],
})
