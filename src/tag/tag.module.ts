import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from 'src/courses/Course.module';
import { Course } from 'src/courses/entities/Course.entity';
import { CourseService } from 'src/courses/services/course.service';
import { Tag } from './entities/tag.entity';
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Course])],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
