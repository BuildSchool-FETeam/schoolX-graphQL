import { UseGuards } from '@nestjs/common'
import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator'
import { AuthGuard } from 'src/common/guards/auth.guard'
import {
  FilterArticleInput,
  PaginationInput,
  SearchOptionInput,
} from 'src/graphql'
import { ArticleService } from '../services/article.service'
import { ArticleTagService } from '../services/articleTag.service'

@UseGuards(AuthGuard)
@Resolver('ArticleQuery')
export class ArticleQueryResolver {
  constructor(
    private articleService: ArticleService,
    private articleTagService: ArticleTagService
  ) {}

  @Query()
  articleQuery() {
    return {}
  }

  @PermissionRequire({ blog: ['C:x', 'R:*', 'U:x', 'D:x'] })
  @ResolveField('articles')
  async getAllArticles(
    @Args('pagination') pg?: PaginationInput,
    @Args('searchOption') sOpt?: SearchOptionInput
  ) {
    const paginationOption = this.articleService.buildPaginationOptions(pg)
    const searchOption = this.articleService.buildSearchOptions(sOpt)

    return this.articleService.findWithOptions({
      ...paginationOption,
      ...searchOption,
    })
  }

  @PermissionRequire({ blog: ['C:x', 'R:*', 'U:x', 'D:x'] })
  @ResolveField('filteredArticles')
  async getArticleByFilter(
    @Args('filterOptions') filterOption: FilterArticleInput,
    @Args('pagination') pg: PaginationInput
  ) {
    return this.articleService.filterArticle(filterOption, pg)
  }

  @PermissionRequire({ blog: ['C:x', 'R:*', 'U:x', 'D:x'] })
  @ResolveField('articleDetail')
  async getArticleById(@Args('id') id: string) {
    return this.articleService.findById(id)
  }

  @ResolveField('tags')
  @PermissionRequire({ blog: ['C:x', 'R:*', 'U:x', 'D:x'] })
  async getAllTags(
    @Args('pagination') pg?: PaginationInput,
    @Args('searchOption') sOpt?: SearchOptionInput
  ) {
    const paginationOption = this.articleService.buildPaginationOptions(pg)
    const searchOption = this.articleService.buildSearchOptions(sOpt)

    return this.articleTagService.findWithOptions({
      ...paginationOption,
      ...searchOption,
    })
  }
}
