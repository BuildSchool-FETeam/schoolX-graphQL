import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Course } from 'src/courses/entities/Course.entity';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService extends BaseService<Tag> {
  constructor(
    @InjectRepository(Tag)
    private tagRepo: Repository<Tag>,
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
  ) {
    super(tagRepo, 'Tag');
  }

  async addTag(data: { title: string; courseId: string }) {
    const existedTags = await this.tagRepo.find({
      where: { title: data.title },
      relations: ['courses'],
    });
    const course = await this.courseRepo.findOne(data.courseId);

    let tag: Tag;
    if (existedTags.length === 0) {
      tag = this.tagRepo.create({ title: data.title, courses: [] });
    } else {
      tag = existedTags[0];
    }
    tag.courses.push(course);
    return this.tagRepo.save(tag);
  }
}
