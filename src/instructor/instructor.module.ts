import { Instructor } from './entities/Instructor.entity';
import { InstructorMutationResolver } from './reslovers/instructorMutation.resolver';
import { InstructorService } from './services/instructor.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/Common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Instructor]), CommonModule],
  providers: [InstructorService, InstructorMutationResolver],
})
export class InstructorModule {}
