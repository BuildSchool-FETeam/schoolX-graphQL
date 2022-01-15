import { Test } from '@nestjs/testing'
import { ArticleTagService } from 'src/article/services/articleTag.service'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { baseServiceMock } from 'src/common/mock/baseServiceMock'
import { guardMock } from 'src/common/mock/guardMock'
import {
  createArticleEntityMock,
  createArticleTag,
} from 'src/common/mock/mockEntity'
import { ArticleTagTypeResolver } from '../articleTagType.resolver'

const articleTagServiceMock = {
  ...baseServiceMock,
}

describe('ArticleTagType', () => {
  let resolver: ArticleTagTypeResolver

  beforeAll(async () => {
    const testModule = Test.createTestingModule({
      providers: [ArticleTagTypeResolver, ArticleTagService],
    })

    testModule
      .overrideProvider(ArticleTagService)
      .useValue(articleTagServiceMock)
    testModule.overrideGuard(AuthGuard).useValue(guardMock)

    const compiledModule = await testModule.compile()

    resolver = compiledModule.get(ArticleTagTypeResolver)
  })

  describe('articles', () => {
    it('should return articles list', async () => {
      const articleTagMock = createArticleTag()
      articleTagMock.articles = [
        createArticleEntityMock({ id: '1' }),
        createArticleEntityMock({ id: '2' }),
      ]

      jest
        .spyOn(articleTagServiceMock, 'findById')
        .mockResolvedValue(articleTagMock)

      const result = await resolver.articles(articleTagMock)

      expect(result).toEqual([
        createArticleEntityMock({ id: '1' }),
        createArticleEntityMock({ id: '2' }),
      ])
    })
  })
})
