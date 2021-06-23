import { UserCommentTypeResolver } from './resolvers/userCommentType.resolver';
import { UserCommentMutationResolver } from './resolvers/userCommentMutation.resolver';
import { CommonModule } from './../common/Common.module';
import { ArticleModule } from './../article/article.module';
import { CourseModule } from './../courses/Course.module';
import { UserComment } from './entities/UserComment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCommentService } from './services/userComment.service';
import { Module, forwardRef } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserComment]), 
    forwardRef(() => CourseModule),
    forwardRef(() => ArticleModule),
    CommonModule
  ],
  providers: [UserCommentService, UserCommentMutationResolver, UserCommentTypeResolver]
})
export class CommentModule {}
