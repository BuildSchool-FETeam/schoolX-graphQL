import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ArticleTag } from 'src/article/entities/ArticleTag.entity'
import { createArticleTag } from 'src/common/mock/mockEntity'
import { repositoryMockFactory } from 'src/common/mock/repositoryMock'
import { Repository } from 'typeorm'
import { ArticleTagService } from '../articleTag.service'

describe('ArticleTagService', () => {
  let articleTagRepo: Repository<ArticleTag>
  let articleTagService: ArticleTagService

  beforeAll(async () => {
    const testModule = Test.createTestingModule({
      providers: [
        ArticleTagService,
        {
          provide: getRepositoryToken(ArticleTag),
          useFactory: repositoryMockFactory,
        },
      ],
    })

    const compiledModule = await testModule.compile()

    articleTagRepo = compiledModule.get(getRepositoryToken(ArticleTag))
    articleTagService = compiledModule.get(ArticleTagService)
  })

  describe('createArticleTag', () => {
    it('should not create new tag with existing one', async () => {
      const tagsInput = ['tag_1', 'tag_2']
      const spyCreate = jest.spyOn(articleTagRepo, 'create')
      const listTags = [createArticleTag(), createArticleTag()]
      jest
        .spyOn(articleTagRepo, 'findOne')
        .mockResolvedValue(createArticleTag())

      const result = await articleTagService.createArticleTag(tagsInput)

      expect(spyCreate).not.toHaveBeenCalled()
      expect(result).toEqual(listTags)
    })

    it('should create and also just return the existing tag', async () => {
      const tagsInput = ['tag_1', 'tag_2']
      const spyCreate = jest.spyOn(articleTagRepo, 'create')
      const listTags = [createArticleTag(), createArticleTag()]

      spyCreate.mockReturnValue(createArticleTag())

      jest.spyOn(articleTagRepo, 'findOne').mockResolvedValue(undefined)

      const result = await articleTagService.createArticleTag(tagsInput)

      expect(spyCreate).toHaveBeenCalledTimes(2)
      expect(result).toEqual(listTags)
    })
  })
})
