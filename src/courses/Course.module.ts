import { Course } from 'src/courses/entities/Course.entity';
import { CommonModule } from 'src/common/Common.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagModule } from 'src/tag/tag.module';
import { AssignmentModule } from 'src/assignment/assignment.module';
import { ClientUserModule } from 'src/clientUser/clientUser.module';
import { AdminUserModule } from '../adminUser/AdminUser.module';
import { LessonDocument } from './entities/LessonDocument.entity';
import { LessonDocumentService } from './services/document.service';
import { LessonQueryResolver } from './resolvers/lesson/lessonQuery.resolver';
import { InstructorModule } from '../instructor/instructor.module';
import { CourseService } from './services/course.service';
import { CourseMutationResolver } from './resolvers/course/courseMutation.resolver';
import { CourseQueryResolver } from './resolvers/course/courseQuery.resolver';
import { CourseTypeResolver } from './resolvers/course/courseType.resolver';
import { Lesson } from './entities/Lesson.entity';
import { LessonService } from './services/lesson.service';
import { LessonMutationResolver } from './resolvers/lesson/lessonMutation.resolver';
import { LessonTypeResolver } from './resolvers/lesson/lessonType.resolver';
import { LessonDocumentMutationResolver } from './resolvers/lessonDocument/documentMutation.resolver';

@Module({
  imports: [
    forwardRef(() => CommonModule),
    TypeOrmModule.forFeature([Course, Lesson, LessonDocument]),
    forwardRef(() => InstructorModule),
    TagModule,
    AdminUserModule,
    AssignmentModule,
  ],
  providers: [
    CourseMutationResolver,
    CourseService,
    CourseTypeResolver,
    CourseQueryResolver,
    LessonService,
    LessonMutationResolver,
    LessonTypeResolver,
    LessonQueryResolver,
    LessonDocumentService,
    LessonDocumentMutationResolver,
  ],
  exports: [CourseService, LessonDocumentService, LessonService],
})
export class CourseModule {}
