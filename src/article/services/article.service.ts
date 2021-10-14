import { ComplexQueryBuilderService } from './../../common/services/complexQueryBuilder.service';
import { ClientUser } from 'src/clientUser/entities/ClientUser.entity';
import { TokenService } from 'src/common/services/token.service';
import { ArticleTagService } from './articleTag.service';
import {
  ArticleInputType,
  FilterArticleInput,
  ArticleReviewInput,
  ArticleStatus,
  PaginationInput,
} from './../../graphql';
import { Repository } from 'typeorm';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { Article } from 'src/article/entities/Article.entity';
import { BaseService } from 'src/common/services/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { CacheService } from 'src/common/services/cache.service';
import { PermissionEnum } from 'src/common/enums/permission.enum';

@Injectable()
export class ArticleService extends BaseService<Article> {
  constructor(
    @InjectRepository(Article)
    private articleRepo: Repository<Article>,
    private articleTagService: ArticleTagService,
    private tokenService: TokenService,
    protected cachingService: CacheService,
    private queryBuilderService: ComplexQueryBuilderService,
  ) {
    super(articleRepo, 'Article', cachingService);
  }

  async createArticle(data: ArticleInputType, token: string) {
    const clientUser = await this.tokenService.getAdminUserByToken<ClientUser>(
      token,
    );

    const article = this.articleRepo.create({
      title: data.title,
      shortDescription: data.shortDescription,
      content: data.content,
      createdBy: clientUser,
    });

    const tags = await this.articleTagService.createArticleTag(data.tags);

    article.tags = tags;

    return this.articleRepo.save(article);
  }

  async updateArticle(data: ArticleInputType, token: string, id: string) {
    const existedArticle = await this.findById(
      id,
      {},
      { strictResourceName: 'blog', token },
    );

    _.forOwn(data, (value, key) => {
      if (key !== 'tags') {
        value && (existedArticle[key] = value);
      }
    });
    if (_.size(data.tags) > 0) {
      const tags = await this.articleTagService.createArticleTag(data.tags);

      existedArticle.tags = tags;
    }

    return this.articleRepo.save(existedArticle);
  }

  async deleteArticle(id: string, token: string) {
    const existedData = await this.findById(
      id,
      {},
      { strictResourceName: 'blog', token },
    );

    existedData.tags = [];
    await this.articleRepo.save(existedData);

    return this.deleteOneById(id, { strictResourceName: 'blog', token });
  }

  async filterArticle(data: FilterArticleInput, pagination?: PaginationInput) {
    const articleQuery = this.articleRepo
      .createQueryBuilder('article')
      .select()
      .where('article.title IS NOT NULL'); // just a dummy where

    if (data.byTag) {
      articleQuery.innerJoin(
        'article.tags',
        'articleTag',
        'articleTag.title IN (:...titles)',
        { titles: data.byTag },
      );
    }

    if (data.byDate) {
      this.queryBuilderService.addAndWhereCompareToQueryBuilder(
        articleQuery,
        {
          fieldCompare: 'createdAt',
          tableAlias: 'article',
          compareType: 'date',
        },
        data.byDate,
      );
    }

    if (data.byStatus) {
      this.queryBuilderService.addAndWhereCompareToQueryBuilder(
        articleQuery,
        {
          fieldCompare: 'status',
          tableAlias: 'article',
          compareType: 'string',
        },
        data.byStatus,
      );
    }

    this.queryBuilderPagination(articleQuery, pagination);

    const queryData = await articleQuery.getMany();

    return queryData;
  }

  async reviewArticle(id: string, data: ArticleReviewInput, token: string) {
    const user = await this.tokenService.getAdminUserByToken(token);

    if (user?.role?.name === PermissionEnum.CLIENT_PERMISSION) {
      throw new ForbiddenException(
        "You don't have permission to do this action",
      );
    }

    const article = await this.findById(id);

    article.reviewComment = data.comment;
    article.status = data.status as ArticleStatus;

    return this.articleRepo.save(article);
  }
}
