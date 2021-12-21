import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { AssignmentModule } from 'src/assignment/assignment.module';
import { Assignment } from 'src/assignment/entities/Assignment.entity';
import { UserCommentTypeResolver } from './resolvers/userCommentType.resolver';
import { UserCommentMutationResolver } from './resolvers/userCommentMutation.resolver';
import { CommonModule } from '../common/Common.module';
import { ArticleModule } from '../article/article.module';
import { CourseModule } from '../courses/Course.module';
import { UserComment } from './entities/UserComment.entity';
import { UserCommentService } from './services/userComment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserComment, Assignment]),
    forwardRef(() => CourseModule),
    forwardRef(() => ArticleModule),
    ArticleModule,
    CommonModule,
    forwardRef(() => AssignmentModule),
  ],
  providers: [
    UserCommentService,
    UserCommentMutationResolver,
    UserCommentTypeResolver,
  ],
  exports: [UserCommentService],
})
export class CommentModule {}
