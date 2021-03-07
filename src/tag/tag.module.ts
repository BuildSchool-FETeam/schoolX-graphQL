import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/courses/entities/Course.entity';
import { Tag } from './entities/tag.entity';
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Course])],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
