import { AuthGuard } from 'src/common/guards/auth.guard'
import { UseGuards } from '@nestjs/common'
import {
  Args,
  Context,
  Mutation,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { PermissionRequire } from 'src/common/decorators/PermissionRequire.decorator'
import { ArticleService } from '../services/article.service'
import { ArticleInputType, ArticleReviewInput } from '../../graphql'

@UseGuards(AuthGuard)
@Resolver('ArticleMutation')
export class ArticleMutationResolver {
  constructor(private articleService: ArticleService) {}

  @Mutation()
  articleMutation() {
    return {}
  }

  @PermissionRequire({ blog: ['C:*', 'R:x', 'U:*', 'D:x'] })
  @ResolveField()
  async setArticle(
    @Args('data') data: ArticleInputType,
    @Context() { req }: DynamicObject,
    @Args('id') id?: string
  ) {
    const token = this.articleService.getTokenFromHttpHeader(req.headers)

    if (!id) {
      return this.articleService.createArticle(data, token)
    }

    return this.articleService.updateArticle(data, token, id)
  }

  @PermissionRequire({ blog: ['C:x', 'R:x', 'U:x', 'D:*'] })
  @ResolveField()
  async deleteArticle(
    @Context() { req }: DynamicObject,
    @Args('id') id: string
  ) {
    const token = this.articleService.getTokenFromHttpHeader(req.headers)

    await this.articleService.deleteArticle(id, token)

    return true
  }

  @PermissionRequire({ blog: ['C:x', 'R:x', 'U:+', 'D:x'] })
  @ResolveField()
  async reviewArticle(
    @Args('id') id: string,
    @Args('data') data: ArticleReviewInput
  ) {
    return this.articleService.reviewArticle(id, data)
  }
}
