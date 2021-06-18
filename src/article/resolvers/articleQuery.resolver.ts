import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ArticleService } from '../services/article.service';

@Resolver('ArticleQuery')
export class ArticleQueryResolver {
  constructor(private articleService: ArticleService) {}

  @Query()
  articleQuery() {
    return {};
  }

  @ResolveField('articles')
  getAllArticles() {
    return this.articleService.findWithOptions();
  }
}
