import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { ArticleTag } from '../entities/ArticleTag.entity'
import { ArticleTagService } from '../services/articleTag.service'

@Resolver('ArticleTagType')
export class ArticleTagTypeResolver {
  constructor(private articleTagService: ArticleTagService) {}

  @ResolveField()
  async articles(@Parent() articleTag: ArticleTag) {
    const tagWithArticles = await this.articleTagService.findById(
      articleTag.id,
      {
        relations: ['articles'],
      }
    )

    return tagWithArticles.articles
  }
}
