import { Repository } from 'typeorm'
import { BaseService } from 'src/common/services/base.service'
import { InjectRepository } from '@nestjs/typeorm'
import * as _ from 'lodash'
import { ArticleTag } from '../entities/ArticleTag.entity'

export class ArticleTagService extends BaseService<ArticleTag> {
  constructor(
    @InjectRepository(ArticleTag)
    private articleTagRepo: Repository<ArticleTag>
  ) {
    super(articleTagRepo, 'Article Tag')
  }

  async createArticleTag(tags: string[]) {
    const promises = _.map(tags, async (tag) => {
      const existedTag = await this.articleTagRepo.findOne({
        where: { title: tag },
        relations: ['articles'],
      })

      if (existedTag) {
        return this.articleTagRepo.save(existedTag)
      }
      const newTag = this.articleTagRepo.create({
        title: tag,
      })

      return this.articleTagRepo.save(newTag)
    })

    const allTags = await Promise.all(promises)

    return allTags
  }
}
