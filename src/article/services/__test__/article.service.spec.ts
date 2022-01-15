import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import * as _ from 'lodash'
import { Article } from 'src/article/entities/Article.entity'
import {
  createArticleEntityMock,
  createArticleTag,
  createClientUserEntityMock,
} from 'src/common/mock/mockEntity'
import { repositoryMockFactory } from 'src/common/mock/repositoryMock'
import { CacheService } from 'src/common/services/cache.service'
import { ComplexQueryBuilderService } from 'src/common/services/complexQueryBuilder.service'
import { TokenService } from 'src/common/services/token.service'
import {
  ArticleInputType,
  ArticleReviewInput,
  ArticleStatus,
  FilterArticleInput,
} from 'src/graphql'
import { DeleteResult, Repository } from 'typeorm'
import { ArticleService } from '../article.service'
import { ArticleTagService } from '../articleTag.service'

const articleTagServiceMock = {
  async createArticleTag(tags: string[]) {
    return Promise.resolve(
      tags.map((tag) => {
        return createArticleTag({ title: tag })
      })
    )
  },
}
const tokenServiceMock = {
  async getAdminUserByToken() {
    return Promise.resolve({})
  },
}
const cacheServiceMock = {}
const complexQueryServiceMock = {
  addAndWhereCompareToQueryBuilder() {
    return
  },
}

describe('ArticleService', () => {
  let articleService: ArticleService
  let articleRepo: Repository<Article>

  beforeAll(async () => {
    const module = Test.createTestingModule({
      providers: [
        ArticleService,
        ArticleTagService,
        TokenService,
        CacheService,
        ComplexQueryBuilderService,
        {
          provide: getRepositoryToken(Article),
          useFactory: repositoryMockFactory,
        },
      ],
    })

    module.overrideProvider(ArticleTagService).useValue(articleTagServiceMock)
    module.overrideProvider(TokenService).useValue(tokenServiceMock)
    module.overrideProvider(CacheService).useValue(cacheServiceMock)

    module
      .overrideProvider(ComplexQueryBuilderService)
      .useValue(complexQueryServiceMock)

    const compliedModule = await module.compile()

    articleService = compliedModule.get(ArticleService)
    articleRepo = compliedModule.get(getRepositoryToken(Article))
  })

  describe('createArticle', () => {
    it('should create an article', async () => {
      const articleInput: ArticleInputType = {
        title: 'art 1',
        shortDescription: 'short desc',
        content: 'big content',
        tags: ['tag_1', 'tag_2'],
      }

      const clientUserMock = createClientUserEntityMock({
        name: 'leesin',
        id: '1',
      })

      jest
        .spyOn(tokenServiceMock, 'getAdminUserByToken')
        .mockResolvedValue(clientUserMock)

      jest
        .spyOn(articleRepo, 'create')
        .mockImplementation(
          (data) => ({ ...createArticleEntityMock(), ...data } as Article)
        )

      const result = await articleService.createArticle(
        articleInput,
        'be token'
      )

      const expectedResult: Article = {
        title: articleInput.title,
        shortDescription: articleInput.shortDescription,
        content: articleInput.content,
        votes: 0,
        status: ArticleStatus.pending,
        createdBy: clientUserMock,
        comments: [],
        views: 0,
        shares: 0,
        reviewComment: '',
        tags: [
          createArticleTag({ title: articleInput.tags[0] }),
          createArticleTag({ title: articleInput.tags[1] }),
        ],
        id: '',
        createdAt: new Date('1-6-2022'),
        updatedAt: new Date('1-6-2022'),
      }

      expect(result).toEqual(expectedResult)
    })
  })

  describe('updateArticle', () => {
    const inputData: ArticleInputType = {
      title: 'My love 123',
      shortDescription: 'desc 123',
      content: 'content 123',
      tags: null,
    }

    let foundArticle: Article

    beforeEach(() => {
      foundArticle = createArticleEntityMock({
        id: '2',
        title: 'My love',
      })

      jest.spyOn(articleService, 'findById').mockResolvedValue(foundArticle)
    })

    it('should update article WITHOUT tags', async () => {
      const createTagSpy = jest.spyOn(articleTagServiceMock, 'createArticleTag')

      const result = await articleService.updateArticle(
        inputData,
        'token',
        'id'
      )

      const expectResult = _.assign(foundArticle, inputData)

      expect(result).toEqual(expectResult)
      expect(createTagSpy).not.toHaveBeenCalled()
    })

    it('should update article WITH tags', async () => {
      inputData.tags = ['tag_1', 'tag_2']
      const clonedInputData = _.clone(inputData)

      const result = await articleService.updateArticle(
        inputData,
        'token',
        'id'
      )

      const clonedArticle = _.clone(foundArticle)

      const expectedResult = _.assign(
        clonedArticle,
        _.omit(clonedInputData, 'tags')
      )

      expectedResult.tags = [
        createArticleTag({ title: inputData.tags[0] }),
        createArticleTag({ title: inputData.tags[1] }),
      ]

      expect({ ...result }).toEqual(expectedResult)
    })
  })

  describe('deleteArticle', () => {
    it('should delete article by id', async () => {
      const delResult: DeleteResult = {
        raw: undefined,
      }

      jest
        .spyOn(articleService, 'findById')
        .mockResolvedValue(createArticleEntityMock())
      jest.spyOn(articleService, 'deleteOneById').mockResolvedValue(delResult)

      const result = await articleService.deleteArticle('id', 'token')

      expect(result).toEqual(delResult)
    })
  })

  describe('filterArticle', () => {
    it('should filter article by filter input', async () => {
      const inputData: FilterArticleInput = {
        byDate: { gt: new Date().toISOString() },
        byTag: ['some tag'],
        byStatus: { eq: 'pending' },
      }

      const spyAddQuery = jest.spyOn(
        complexQueryServiceMock,
        'addAndWhereCompareToQueryBuilder'
      )

      const result = await articleService.filterArticle(inputData)

      expect(spyAddQuery).toHaveBeenCalledTimes(2)
      expect(result).toEqual([])
    })
  })

  describe('reviewArticle', () => {
    it('should update article after review', async () => {
      const articleMock = createArticleEntityMock()

      const reviewInput: ArticleReviewInput = {
        comment: 'look ok',
        status: ArticleStatus.accept,
      }

      const result = await articleService.reviewArticle('id', reviewInput)

      const expectedResult = _.cloneDeep(articleMock)
      expectedResult.reviewComment = 'look ok'
      expectedResult.status = ArticleStatus.accept

      expect(result).toEqual(expectedResult)
    })
  })
})
