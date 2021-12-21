import { CommonModule } from 'src/common/Common.module';
import { Article } from 'src/article/entities/Article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ArticleTag } from './entities/ArticleTag.entity';
import { ArticleTagService } from './services/articleTag.service';
import { ArticleMutationResolver } from './resolvers/articleMutation.resolver';
import { ArticleService } from './services/article.service';
import { ArticleQueryResolver } from './resolvers/articleQuery.resolver';
import { ArticleTypeResolver } from './resolvers/articleType.resolver';
import { ArticleTagTypeResolver } from './resolvers/articleTagType.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Article, ArticleTag]), CommonModule],
  providers: [
    ArticleService,
    ArticleMutationResolver,
    ArticleTagService,
    ArticleQueryResolver,
    ArticleTypeResolver,
    ArticleTagTypeResolver,
  ],
  exports: [ArticleService],
})
export class ArticleModule {}
