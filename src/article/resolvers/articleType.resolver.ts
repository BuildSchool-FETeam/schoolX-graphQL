import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Article } from '../entities/Article.entity';
import { ArticleService } from '../services/article.service';

@Resolver('ArticleType')
export class ArticleTypeResolver {
  constructor(private articleService: ArticleService) {}

  @ResolveField()
  async author(@Parent() article: Article) {
    const articleWithAuthor = await this.articleService.findById(article.id, {
      relations: ['author'],
    });

    return articleWithAuthor.author;
  }

  @ResolveField()
  async tags(@Parent() article: Article) {
    const articleWithTags = await this.articleService.findById(article.id, {
      relations: ['tags'],
    });

    return articleWithTags.tags;
  }
}
