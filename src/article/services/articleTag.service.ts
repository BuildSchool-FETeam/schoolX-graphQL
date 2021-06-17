import { Repository } from 'typeorm';
import { ArticleTag } from './../entities/ArticleTag.entity';
import { BaseService } from 'src/common/services/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';

export class ArticleTagService extends BaseService<ArticleTag> {
  constructor(
    @InjectRepository(ArticleTag)
    private articleTagRepo: Repository<ArticleTag>
  ) {
    super(articleTagRepo, 'Article Tag')
  }

  async createArticleTag(tags: string[]) {
    const existedTags: ArticleTag[] = [];
    const promisesAfterCreatedTag: Array<Promise<ArticleTag>> = []

    _.each(tags, async tag => {
      const existedTag = await this.articleTagRepo.findOne({where: {title: tag}})

      if (existedTag) {
        existedTags.push(existedTag);
      } else {
        const newTag = this.articleTagRepo.create({title: tag, articles: []})
        promisesAfterCreatedTag.push(
          this.articleTagRepo.save(newTag)
        )
      }
    })

    const newTags = await Promise.all(promisesAfterCreatedTag);
    return [...existedTags, ...newTags];
  }
}
