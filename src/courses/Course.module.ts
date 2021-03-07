import { InstructorModule } from './../instructor/instructor.module';
import { CourseService } from './services/course.service';
import { Course } from 'src/courses/entities/Course.entity';
import { CommonModule } from 'src/common/Common.module';
import { forwardRef, Module } from '@nestjs/common';
import { CourseMutationResolver } from './resolvers/course/courseMutation.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagModule } from 'src/tag/tag.module';
import { CourseQueryResolver } from './resolvers/course/courseQuery.resolver';
import { CourseTypeResolver } from './resolvers/course/courseType.resolver';
import { Lesson } from './entities/Lesson.entity';
import { LessonService } from './services/lesson.service';
import { LessonMutationResolver } from './resolvers/lesson/lessonMutation.resolver';
import { LessonTypeResolver } from './resolvers/lesson/lessonType.resolver';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([Course, Lesson]),
    forwardRef(() => InstructorModule),
    TagModule,
  ],
  providers: [
    CourseMutationResolver,
    CourseService,
    CourseTypeResolver,
    CourseQueryResolver,
    LessonService,
    LessonMutationResolver,
    LessonTypeResolver,
  ],
  exports: [CourseService],
})
export class CourseModule {}
