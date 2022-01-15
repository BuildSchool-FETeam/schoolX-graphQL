import { Test } from '@nestjs/testing'
import { Article } from 'src/article/entities/Article.entity'
import { ArticleService } from 'src/article/services/article.service'
import { AuthGuard } from 'src/common/guards/auth.guard'
import { baseServiceMock } from 'src/common/mock/baseServiceMock'
import { guardMock } from 'src/common/mock/guardMock'
import {
  createArticleEntityMock,
  createArticleTag,
  createClientUserEntityMock,
  createCommentEntityMock,
} from 'src/common/mock/mockEntity'
import { ArticleTypeResolver } from '../articleType.resolver'

const articleServiceMock = {
  ...baseServiceMock,
}

describe('ArticleTypeResolver', () => {
  let resolver: ArticleTypeResolver

  beforeAll(async () => {
    const testModule = Test.createTestingModule({
      providers: [ArticleTypeResolver, ArticleService],
    })

    testModule.overrideProvider(ArticleService).useValue(articleServiceMock)
    testModule.overrideGuard(AuthGuard).useValue(guardMock)

    const compiledModule = await testModule.compile()

    resolver = compiledModule.get(ArticleTypeResolver)
  })

  let articleMock: Article

  beforeEach(() => {
    articleMock = createArticleEntityMock({ id: '1', title: 'super article' })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('createdBy', () => {
    it('should return create user - client user', async () => {
      articleMock.createdBy = createClientUserEntityMock({ name: 'zed' })

      jest.spyOn(articleServiceMock, 'findById').mockResolvedValue(articleMock)

      const result = await resolver.createdBy(articleMock)

      expect(result).toEqual(createClientUserEntityMock({ name: 'zed' }))
    })
  })

  describe('tags', () => {
    it('should return list of tags', async () => {
      articleMock.tags = [
        createArticleTag({ id: '1' }),
        createArticleTag({ id: '2' }),
      ]

      jest.spyOn(articleServiceMock, 'findById').mockResolvedValue(articleMock)

      const result = await resolver.tags(articleMock)

      expect(result).toEqual([
        createArticleTag({ id: '1' }),
        createArticleTag({ id: '2' }),
      ])
    })
  })

  describe('comments', () => {
    it('should return list of user comments', async () => {
      articleMock.comments = [
        createCommentEntityMock({ id: '1', title: 'comment 1' }),
        createCommentEntityMock({ id: '2', title: 'comment 2' }),
      ]

      jest.spyOn(articleServiceMock, 'findById').mockResolvedValue(articleMock)

      const result = await resolver.comments(articleMock, {})

      expect(result).toEqual([
        createCommentEntityMock({ id: '1', title: 'comment 1' }),
        createCommentEntityMock({ id: '2', title: 'comment 2' }),
      ])
    })
  })
})
