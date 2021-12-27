import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommonModule } from 'src/common/Common.module'
import { Instructor } from 'src/instructor/entities/Instructor.entity'
import { InstructorMutationResolver } from './reslovers/instructorMutation.resolver'
import { InstructorService } from './services/instructor.service'
import { InstructorQueryResolver } from './reslovers/instructorQuery.resolver'
import { InstructorTypeResolver } from './reslovers/instructorType.resolver'

@Module({
  imports: [
    TypeOrmModule.forFeature([Instructor]),
    forwardRef(() => CommonModule),
  ],
  providers: [
    InstructorService,
    InstructorMutationResolver,
    InstructorQueryResolver,
    InstructorTypeResolver,
  ],
  exports: [InstructorService],
})
export class InstructorModule {}
