import { CourseTypeResolver } from 'src/courses/resolvers/courseType.resolver';
import { InstructorModule } from './../instructor/instructor.module';
import { CourseService } from './services/course.service';
import { Course } from 'src/courses/entities/Course.entity';
import { CommonModule } from 'src/common/Common.module';
import { forwardRef, Module } from '@nestjs/common';
import { CourseMutationResolver } from './resolvers/courseMutation.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseQueryResolver } from './resolvers/courseQuery.resolver';
import { TagModule } from 'src/tag/tag.module';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([Course]),
    forwardRef(() => InstructorModule),
    TagModule,
  ],
  providers: [
    CourseMutationResolver,
    CourseService,
    CourseTypeResolver,
    CourseQueryResolver,
  ],
  exports: [CourseService],
})
export class CourseModule {}
