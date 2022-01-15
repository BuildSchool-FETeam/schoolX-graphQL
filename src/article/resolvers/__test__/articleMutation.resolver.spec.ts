import { Test } from '@nestjs/testing'
import { ArticleService } from 'src/article/services/article.service'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { guardMock } from 'src/common/mock/guardMock'
import { createArticleEntityMock } from 'src/common/mock/mockEntity'
import { requestMock } from 'src/common/mock/requestObjectMock'
import { ArticleInputType } from 'src/graphql'
import { ArticleMutationResolver } from '../articleMutation.resolver'

const articleServiceMock = {
  getTokenFromHttpHeader() {
    return 'token'
  },
  async createArticle() {
    return Promise.resolve(createArticleEntityMock())
  },
  async updateArticle() {
    return Promise.resolve(createArticleEntityMock())
  },
}

describe('ArticleMutationResolver', () => {
  let resolver: ArticleMutationResolver

  beforeAll(async () => {
    const testModule = Test.createTestingModule({
      providers: [ArticleMutationResolver, ArticleService],
    })

    testModule.overrideProvider(ArticleService).useValue(articleServiceMock)
    testModule.overrideGuard(AuthGuard).useValue(guardMock)

    const compiledModule = await testModule.compile()

    resolver = compiledModule.get(ArticleMutationResolver)
  })

  describe('articleMutation', () => {
    it('should return empty object', () => {
      expect(resolver.articleMutation()).toEqual({})
    })
  })

  describe('setArticle', () => {
    const articleInput: ArticleInputType = {
      title: 'title 1',
      shortDescription: 'short desc 1',
      content: 'test content',
      tags: [],
    }

    let spyCreate: jest.SpyInstance<Promise<DynamicObject>>
    let spyUpdate: jest.SpyInstance<Promise<DynamicObject>>

    beforeEach(() => {
      spyCreate = jest.spyOn(articleServiceMock, 'createArticle')
      spyUpdate = jest.spyOn(articleServiceMock, 'updateArticle')
    })

    it('should create new article if it does not have an id', async () => {
      spyCreate.mockResolvedValue(createArticleEntityMock())

      const result = await resolver.setArticle(
        articleInput,
        requestMock,
        undefined
      )

      expect(spyCreate).toHaveBeenCalled()
      expect(spyUpdate).not.toHaveBeenCalled()
      expect(result).toEqual(createArticleEntityMock())

      jest.resetAllMocks()
    })

    it('should update article if it has an id', async () => {
      spyUpdate.mockResolvedValue(createArticleEntityMock())

      const result = await resolver.setArticle(articleInput, requestMock, 'id')

      expect(spyCreate).not.toHaveBeenCalled()
      expect(spyUpdate).toHaveBeenCalled()
      expect(result).toEqual(createArticleEntityMock())
    })
  })
})
