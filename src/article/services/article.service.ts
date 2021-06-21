import { ClientUser } from 'src/clientUser/entities/ClientUser.entity';
import { TokenService } from 'src/common/services/token.service';
import { ArticleTagService } from './articleTag.service';
import { ArticleInputType, FilterArticleInput } from './../../graphql';
import { Brackets, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Article } from 'src/article/entities/Article.entity';
import { BaseService } from 'src/common/services/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { CacheService } from 'src/common/services/cache.service';

@Injectable()
export class ArticleService extends BaseService<Article> {
  constructor(
    @InjectRepository(Article)
    private articleRepo: Repository<Article>,
    private articleTagService: ArticleTagService,
    private tokenService: TokenService,
    protected cachingService: CacheService,
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

  async filterArticle(data: FilterArticleInput) {
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
      articleQuery.andWhere(
        new Brackets((qb) => {
          const dummyWhere = qb.where('article.id IS NOT NULL');

          _.forOwn(data.byDate, (value, key) => {
            const {
              compareString,
              compareObj,
            } = this.buildTheCompareStringForDate(
              {
                field: 'createdAt',
                alias: 'article',
              },
              value,
              key,
            );

            dummyWhere.andWhere(compareString, compareObj);
          });
        }),
      );
    }

    return articleQuery.getMany();
  }

  private buildTheCompareStringForDate(
    stringBuilderConfig: { field: string; alias: string },
    valueCompare: number,
    key: string,
  ) {
    let compareString = '';
    let compareVal = {};
    const { field, alias } = stringBuilderConfig;

    function _getQueryString(operator: string) {
      return `${alias}.${field}::date ${operator} :value`;
    }

    switch (key) {
      case 'eq':
        compareString = _getQueryString('=');
        break;
      case 'gt':
        compareString = _getQueryString('>');
        break;
      case 'lt':
        compareString = _getQueryString('<');
        break;
      case 'ne':
        compareString = _getQueryString('!=');
        break;
    }
    compareVal = { value: valueCompare };

    return {
      compareString,
      compareObj: compareVal,
    };
  }
}
