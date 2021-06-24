import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Article } from '../entities/Article.entity';
import { ArticleService } from '../services/article.service';

@Resolver('ArticleType')
export class ArticleTypeResolver {
  constructor(private articleService: ArticleService) {}

  @ResolveField()
  async createdBy(@Parent() article: Article) {
    const articleWithAuthor = await this.articleService.findById(article.id, {
      relations: ['createdBy'],
    });

    return articleWithAuthor.createdBy;
  }

  @ResolveField()
  async tags(@Parent() article: Article) {
    const articleWithTags = await this.articleService.findById(article.id, {
      relations: ['tags'],
    });

    return articleWithTags.tags;
  }

  @ResolveField()
  async comments(@Parent() article: Article) {
    const articleWithTags = await this.articleService.findById(article.id, {
      select: ['id'],
      relations: ['comments'],
    });

    return articleWithTags.comments;
  }
}
