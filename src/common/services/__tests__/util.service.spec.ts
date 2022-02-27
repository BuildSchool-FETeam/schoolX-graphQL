/* eslint-disable @typescript-eslint/no-explicit-any */
import { InternalServerErrorException } from '@nestjs/common/exceptions/internal-server-error.exception'
import { assertThrowError } from 'src/common/mock/customAssertion'
import { QueryBuilderMock } from 'src/common/mock/repositoryMock'
import { requestMock } from 'src/common/mock/requestObjectMock'
import { OrderDirection, PaginationInput, SearchOptionInput } from 'src/graphql'
import { UtilService } from '../util.service'

class TestUtilClass extends UtilService {}

describe('UtilService', () => {
  let service: UtilService

  beforeAll(() => {
    service = new TestUtilClass()
  })

  describe('getTokenFromHttpHeader', () => {
    it('should throw error if cannot get the token', () => {
      assertThrowError(
        service.getTokenFromHttpHeader.bind(service, {}),
        new InternalServerErrorException('Token not found')
      )
    })

    it('should return BE token', () => {
      const token = service.getTokenFromHttpHeader(requestMock.req.headers)

      expect(token).toBe('token')
    })
  })

  describe('buildPaginationOptions', () => {
    it('should build empty option without pagination data', () => {
      const result = service.buildPaginationOptions(null)

      expect(result).toEqual({})
    })

    it('should return a part of pagination options', () => {
      const pagination: PaginationInput = { limit: 10 }

      let result = service.buildPaginationOptions(pagination)
      expect(result).toEqual({ take: 10 })

      pagination.skip = 2

      result = service.buildPaginationOptions(pagination)
      expect(result).toEqual({ take: 10, skip: 2 })

      delete pagination.skip

      pagination.order = {
        orderBy: 'testField',
        direction: OrderDirection.DESC,
      }

      result = service.buildPaginationOptions(pagination)
      expect(result).toEqual({ take: 10, order: { testField: 'DESC' } })
    })

    it('should return full pagination options', () => {
      const pagination: PaginationInput = {
        limit: 10,
        skip: 3,
        order: {
          orderBy: 'testField',
          direction: OrderDirection.DESC,
        },
      }

      const result = service.buildPaginationOptions(pagination)

      expect(result).toEqual({
        take: 10,
        skip: 3,
        order: {
          testField: 'DESC',
        },
      })
    })
  })
  describe('manuallyPagination', () => {
    const items = [
      { name: 'a', age: 10, id: 3 },
      { name: 'b', age: 12, id: 1 },
      { name: 'c', age: 14, id: 2 },
    ]

    it('should return full list of items', () => {
      const result = service.manuallyPagination(items, null)

      expect(result).toEqual(items)
    })

    it('should use default pagination with list items', () => {
      const result = service.manuallyPagination(items, {})

      expect(result).toEqual([
        { name: 'b', age: 12, id: 1 },
        { name: 'c', age: 14, id: 2 },
        { name: 'a', age: 10, id: 3 },
      ])
    })

    it('should paginate the list of items with provided pg info v1', () => {
      const result = service.manuallyPagination(items, {
        limit: 1,
        skip: 0,
      })

      expect(result).toEqual([{ name: 'a', age: 10, id: 3 }])
    })
    it('should paginate the list of items with provided pg info v2', () => {
      const result = service.manuallyPagination(items, {
        limit: 2,
        skip: 1,
      })

      expect(result).toEqual([
        { name: 'b', age: 12, id: 1 },
        { name: 'c', age: 14, id: 2 },
      ])
    })

    it('should paginate the list of items with provided pg info v3', () => {
      const result = service.manuallyPagination(items, {
        limit: 2,
        skip: 1,
        order: {
          orderBy: 'id',
          direction: OrderDirection.DESC,
        },
      })

      expect(result).toEqual([
        { name: 'c', age: 14, id: 2 },
        { name: 'b', age: 12, id: 1 },
      ])
    })

    it('should paginate the list of items with provided pg info v4', () => {
      const result = service.manuallyPagination(items, {
        limit: 100,
        skip: 0,
        order: {
          orderBy: 'name',
          direction: OrderDirection.DESC,
        },
      })

      expect(result).toEqual([
        { name: 'c', age: 14, id: 2 },
        { name: 'b', age: 12, id: 1 },
        { name: 'a', age: 10, id: 3 },
      ])
    })
  })

  describe('queryBuilderPagination', () => {
    it('should call enough methods with queryBuilder', () => {
      const query = new QueryBuilderMock()

      service.queryBuilderPagination(query as any, {
        limit: 10,
        skip: 1,
        order: {
          orderBy: 'testField',
          direction: OrderDirection.DESC,
        },
      })

      expect(query.mockMethodCalleds.includes('take')).toBe(true)
      expect(query.mockMethodCalleds.includes('skip')).toBe(true)
      expect(query.mockMethodCalleds.includes('orderBy')).toBe(true)
    })
  })

  describe('buildSearchOptions', () => {
    it('should return empty search option', () => {
      const result = service.buildSearchOptions(undefined)

      expect(result).toEqual({})
    })

    it('build the search object', () => {
      const search: SearchOptionInput = {
        searchFields: ['test1', 'test2'],
        searchString: 'leesin',
      }

      const result = service.buildSearchOptions(search)

      expect(result).toEqual({
        where: [
          {
            test1: 'ILike-%leesin%',
          },
          {
            test2: 'ILike-%leesin%',
          },
        ],
      })
    })
  })

  describe('generateActivationCode', () => {
    it('should random an activation code', () => {
      const now = new Date('2022-02-07')

      jest.spyOn(Math, 'random').mockReturnValue(0.2)
      jest.spyOn(Date, 'now').mockReturnValue(now.getTime())

      expect(service.generateActivationCode(8)).toEqual({
        code: 'J4J4J4J',
        expiredTime: 1644220800000,
      })
    })
  })
})
