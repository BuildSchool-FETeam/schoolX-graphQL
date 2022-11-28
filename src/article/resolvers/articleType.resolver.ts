import { Parent, ResolveField, Resolver, Args } from '@nestjs/graphql'
import { PaginationInput } from '../../graphql'
import { Article } from '../entities/Article.entity'
import { ArticleService } from '../services/article.service'

@Resolver('ArticleType')
export class ArticleTypeResolver {
  constructor(private articleService: ArticleService) {}

  @ResolveField()
  async createdBy(@Parent() article: Article) {
    const articleWithAuthor = await this.articleService.findById(article.id, {
      relations: { createdBy: true },
    })

    return articleWithAuthor.createdBy
  }

  @ResolveField()
  async tags(@Parent() article: Article) {
    const articleWithTags = await this.articleService.findById(article.id, {
      relations: { tags: true },
    })

    return articleWithTags.tags
  }

  @ResolveField()
  async comments(
    @Parent() article: Article,
    @Args('pagination') pg: PaginationInput
  ) {
    const articleWithTags = await this.articleService.findById(article.id, {
      select: ['id'],
      relations: { comments: true },
    })

    return this.articleService.manuallyPagination(articleWithTags.comments, pg)
  }
}
