import { CourseTypeResolver } from 'src/courses/resolvers/courseType.resolver';
import { InstructorModule } from './../instructor/instructor.module';
import { CourseService } from './services/course.service';
import { Course } from 'src/courses/entities/Course.entity';
import { CommonModule } from 'src/common/Common.module';
import { forwardRef, Module } from "@nestjs/common";
import { CourseMutationResolver } from "./resolvers/courseMutation.resolver";
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([Course]), forwardRef(() => InstructorModule)],
  providers: [CourseMutationResolver, CourseService, CourseTypeResolver]
})
export class CourseModule { }