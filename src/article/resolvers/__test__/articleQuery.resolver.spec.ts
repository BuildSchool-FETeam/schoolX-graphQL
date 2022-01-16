import { Test } from '@nestjs/testing'
import { ArticleService } from 'src/article/services/article.service'
import { ArticleTagService } from 'src/article/services/articleTag.service'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { baseServiceMock } from 'src/common/mock/baseServiceMock'
import { guardMock } from 'src/common/mock/guardMock'
import {
  createArticleEntityMock,
  createArticleTag,
} from 'src/common/mock/mockEntity'
import { FilterArticleInput, PaginationInput } from 'src/graphql'
import { ArticleQueryResolver } from '../articleQuery.resolver'

const articleServiceMock = {
  ...baseServiceMock,
  async filterArticle() {
    return Promise.resolve([])
  },
}
const articleTagServiceMock = {
  ...baseServiceMock,
}

describe('ArticleQueryResolver', () => {
  let resolver: ArticleQueryResolver

  beforeAll(async () => {
    const testModule = Test.createTestingModule({
      providers: [ArticleQueryResolver, ArticleService, ArticleTagService],
    })

    testModule.overrideProvider(ArticleService).useValue(articleServiceMock)
    testModule.overrideGuard(AuthGuard).useValue(guardMock)
    testModule
      .overrideProvider(ArticleTagService)
      .useValue(articleTagServiceMock)

    const compiledModule = await testModule.compile()

    resolver = compiledModule.get(ArticleQueryResolver)
  })

  describe('articleQuery', () => {
    it('should return empty object', () => {
      expect(resolver.articleQuery()).toEqual({})
    })
  })

  describe('getAllArticles', () => {
    it('should get all articles', async () => {
      jest
        .spyOn(articleServiceMock, 'findWithOptions')
        .mockResolvedValue([
          createArticleEntityMock({ id: '1', title: 'leeson' }),
          createArticleEntityMock({ id: '2', title: 'zed' }),
        ])

      const result = await resolver.getAllArticles()

      expect(result).toEqual([
        createArticleEntityMock({ id: '1', title: 'leeson' }),
        createArticleEntityMock({ id: '2', title: 'zed' }),
      ])
    })
  })

  describe('getArticleByFilter', () => {
    it('should filter article', async () => {
      jest
        .spyOn(articleServiceMock, 'filterArticle')
        .mockResolvedValue([
          createArticleEntityMock({ id: '1', title: 'leeson' }),
          createArticleEntityMock({ id: '2', title: 'zed' }),
        ])

      const filterOpts: FilterArticleInput = {}
      const pg: PaginationInput = {}

      const result = await resolver.getArticleByFilter(filterOpts, pg)

      expect(result).toEqual([
        createArticleEntityMock({ id: '1', title: 'leeson' }),
        createArticleEntityMock({ id: '2', title: 'zed' }),
      ])
    })
  })

  describe('getArticleById', () => {
    it('should get article by ID', async () => {
      jest
        .spyOn(articleServiceMock, 'findById')
        .mockResolvedValue(
          createArticleEntityMock({ id: '1', title: 'leeson' })
        )

      const result = await resolver.getArticleById('id')

      expect(result).toEqual(
        createArticleEntityMock({ id: '1', title: 'leeson' })
      )
    })
  })

  describe('getAllTags', () => {
    it('should egt all article tags', async () => {
      jest
        .spyOn(articleTagServiceMock, 'findWithOptions')
        .mockResolvedValue([
          createArticleTag({ id: '1', title: 'tag1' }),
          createArticleTag({ id: '2', title: 'tag2' }),
        ])

      const result = await resolver.getAllTags()

      expect(result).toEqual([
        createArticleTag({ id: '1', title: 'tag1' }),
        createArticleTag({ id: '2', title: 'tag2' }),
      ])
    })
  })
})
