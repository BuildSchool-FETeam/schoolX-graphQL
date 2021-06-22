import { UseGuards } from '@nestjs/common';
import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import {
  FilterArticleInput,
  PaginationInput,
  SearchOptionInput,
} from 'src/graphql';
import { ArticleService } from '../services/article.service';
import { ArticleTagService } from '../services/articleTag.service';

@UseGuards(AuthGuard)
@Resolver('ArticleQuery')
export class ArticleQueryResolver {
  constructor(
    private articleService: ArticleService,
    private articleTagService: ArticleTagService,
  ) {}

  @Query()
  articleQuery() {
    return {};
  }

  @PermissionRequire({ blog: ['R'] })
  @ResolveField('articles')
  getAllArticles(
    @Args('pagination') pg?: PaginationInput,
    @Args('searchOption') sOpt?: SearchOptionInput,
  ) {
    const paginationOption = this.articleService.buildPaginationOptions(pg);
    const searchOption = this.articleService.buildSearchOptions(sOpt);

    return this.articleService.findWithOptions({
      ...paginationOption,
      ...searchOption,
    });
  }

  @PermissionRequire({ blog: ['R'] })
  @ResolveField('filteredArticles')
  getArticleByFilter(@Args('filterOptions') filterOption: FilterArticleInput) {
    return this.articleService.filterArticle(filterOption);
  }

  @PermissionRequire({ blog: ['R'] })
  @ResolveField('articleDetail')
  getArticleById(@Args('id') id: string) {
    return this.articleService.findById(id);
  }

  @ResolveField('tags')
  @PermissionRequire({ blog: ['R'] })
  getAllTags(
    @Args('pagination') pg?: PaginationInput,
    @Args('searchOption') sOpt?: SearchOptionInput,
  ) {
    const paginationOption = this.articleService.buildPaginationOptions(pg);
    const searchOption = this.articleService.buildSearchOptions(sOpt);

    return this.articleTagService.findWithOptions({
      ...paginationOption,
      ...searchOption,
    });
  }
}
