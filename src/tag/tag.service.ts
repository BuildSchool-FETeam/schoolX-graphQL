import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService extends BaseService<Tag> {
  constructor(
    @InjectRepository(Tag)
    private tagRepo: Repository<Tag>,
  ) {
    super(tagRepo, 'Tag');
  }

  async addTag(data: { title: string }) {
    const existedTags = await this.tagRepo.find({
      where: { title: data.title },
    });

    let tag: Tag;
    if (existedTags.length === 0) {
      tag = this.tagRepo.create({ title: data.title, courses: [] });
    } else {
      tag = existedTags[0];
    }
    return this.tagRepo.save(tag);
  }
}
