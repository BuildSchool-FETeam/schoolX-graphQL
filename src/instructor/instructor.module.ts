import { Instructor } from './entities/Instructor.entity';
import { InstructorMutationResolver } from './reslovers/instructorMutation.resolver';
import { InstructorService } from './services/instructor.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/Common.module';
import { InstructorQueryResolver } from './reslovers/instructorQuery.resolver';
import { CourseTypeResolver } from 'src/courses/resolvers/courseType.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Instructor]), CommonModule],
  providers: [InstructorService, InstructorMutationResolver, InstructorQueryResolver],
  exports: [InstructorService]
})
export class InstructorModule { }
