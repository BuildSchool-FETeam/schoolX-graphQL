import { Instructor } from './entities/Instructor.entity';
import { InstructorMutationResolver } from './reslovers/instructorMutation.resolver';
import { InstructorService } from './services/instructor.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Instructor])],
  providers: [InstructorService, InstructorMutationResolver]
})
export class InstructorModule { }
