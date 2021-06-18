import { ClientUser } from 'src/clientUser/entities/ClientUser.entity';
import { TokenService } from 'src/common/services/token.service';
import { ArticleTagService } from './articleTag.service';
import { ArticleInputType } from './../../graphql';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Article } from 'src/article/entities/Article.entity';
import { BaseService } from 'src/common/services/base.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArticleService extends BaseService<Article> {
  constructor(
    @InjectRepository(Article)
    private articleRepo: Repository<Article>,
    private articleTagService: ArticleTagService,
    private tokenService: TokenService,
  ) {
    super(articleRepo, 'Article');
  }

  async createArticle(data: ArticleInputType, token: string) {
    const clientUser = await this.tokenService.getAdminUserByToken<ClientUser>(
      token,
    );

    const article = this.articleRepo.create({
      title: data.title,
      shortDescription: data.shortDescription,
      content: data.content,
      author: clientUser,
    });

    const tags = await this.articleTagService.createArticleTag(data.tags);

    article.tags = tags;

    return this.articleRepo.save(article);
  }
}
