import { ArticleTag } from './entities/ArticleTag.entity';
import { ArticleTagService } from './services/articleTag.service';
import { ArticleMutationResolver } from './resolvers/articleMutation.resolver';
import { CommonModule } from 'src/common/Common.module';
import { Article } from 'src/article/entities/Article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './services/article.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Article, ArticleTag]), CommonModule],
  providers: [
    ArticleService, 
    ArticleMutationResolver,
    ArticleTagService
  ],
})
export class ArticleModule {}
