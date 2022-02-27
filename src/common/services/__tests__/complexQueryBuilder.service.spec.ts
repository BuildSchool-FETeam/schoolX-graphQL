/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryBuilderMock } from 'src/common/mock/repositoryMock'
import {
  ComplexQueryBuilderService,
  ICompareQueryBuilderConfig,
} from '../complexQueryBuilder.service'

describe('ComplexQueryBuilderService', () => {
  let service: ComplexQueryBuilderService
  const date07 = new Date('2020-07-07').toISOString()
  const date03 = new Date('2020-03-03').toISOString()
  const date12 = new Date('2020-12-12').toISOString()
  const str01 = 'strTest1'
  const str02 = 'strTest2'
  const str03 = 'strTest3'

  beforeAll(() => {
    service = new ComplexQueryBuilderService()
  })

  describe('addAndWhereCompareToQueryBuilder', () => {
    let query: QueryBuilderMock

    beforeEach(() => {
      query = new QueryBuilderMock()
    })

    describe('for date data type', () => {
      const config: ICompareQueryBuilderConfig = {
        fieldCompare: 'test1',
        tableAlias: 'tableAlias',
        compareType: 'date',
      }

      it('should add correct query with one operator GT', () => {
        service.addAndWhereCompareToQueryBuilder(query as any, config, {
          gt: date07,
        })

        expect(query.whereArr).toEqual([
          { queryStr: 'tableAlias.id IS NOT NULL', params: undefined },
        ])
        expect(query.andWhereArr).toEqual([
          { queryStr: 'Brackets', params: null },
          {
            queryStr: 'tableAlias.test1 > :valuegt::date',
            params: { valuegt: date07 },
          },
        ])
      })
      it('should add correct query with one operator EQ', () => {
        service.addAndWhereCompareToQueryBuilder(query as any, config, {
          eq: date07,
        })

        expect(query.whereArr).toEqual([
          { queryStr: 'tableAlias.id IS NOT NULL', params: undefined },
        ])
        expect(query.andWhereArr).toEqual([
          { queryStr: 'Brackets', params: null },
          {
            queryStr: 'tableAlias.test1 = :valueeq::date',
            params: { valueeq: date07 },
          },
        ])
      })

      it('should add correct query with one operator NE', () => {
        service.addAndWhereCompareToQueryBuilder(query as any, config, {
          ne: date07,
        })

        expect(query.whereArr).toEqual([
          { queryStr: 'tableAlias.id IS NOT NULL', params: undefined },
        ])
        expect(query.andWhereArr).toEqual([
          { queryStr: 'Brackets', params: null },
          {
            queryStr: 'tableAlias.test1 != :valuene::date',
            params: { valuene: date07 },
          },
        ])
      })

      it('should add correct query with multiple operator', () => {
        service.addAndWhereCompareToQueryBuilder(query as any, config, {
          gt: date03,
          ne: date07,
          eq: date12,
        })

        expect(query.whereArr).toEqual([
          { queryStr: 'tableAlias.id IS NOT NULL', params: undefined },
        ])
        expect(query.andWhereArr).toEqual([
          { queryStr: 'Brackets', params: null },
          {
            queryStr: 'tableAlias.test1 > :valuegt::date',
            params: { valuegt: date03 },
          },
          {
            queryStr: 'tableAlias.test1 != :valuene::date',
            params: { valuene: date07 },
          },
          {
            queryStr: 'tableAlias.test1 = :valueeq::date',
            params: { valueeq: date12 },
          },
        ])
      })
    })

    describe('for string type data', () => {
      const config: ICompareQueryBuilderConfig = {
        fieldCompare: 'test1',
        tableAlias: 'tableAlias',
        compareType: 'string',
      }

      it('should add correct query with single operator NE', () => {
        service.addAndWhereCompareToQueryBuilder(query as any, config, {
          ne: str01,
        })

        expect(query.whereArr).toEqual([
          { queryStr: 'tableAlias.id IS NOT NULL', params: undefined },
        ])
        expect(query.andWhereArr).toEqual([
          { queryStr: 'Brackets', params: null },
          {
            queryStr: 'tableAlias.test1 != :valuene',
            params: { valuene: str01 },
          },
        ])
      })

      it('should add correct query with single operator EQ', () => {
        service.addAndWhereCompareToQueryBuilder(query as any, config, {
          eq: str02,
        })

        expect(query.whereArr).toEqual([
          { queryStr: 'tableAlias.id IS NOT NULL', params: undefined },
        ])
        expect(query.andWhereArr).toEqual([
          { queryStr: 'Brackets', params: null },
          {
            queryStr: 'tableAlias.test1 = :valueeq',
            params: { valueeq: str02 },
          },
        ])
      })

      it('should add correct query with single operator NC (not contains)', () => {
        service.addAndWhereCompareToQueryBuilder(query as any, config, {
          nc: str02,
        })

        expect(query.whereArr).toEqual([
          { queryStr: 'tableAlias.id IS NOT NULL', params: undefined },
        ])
        expect(query.andWhereArr).toEqual([
          { queryStr: 'Brackets', params: null },
          {
            queryStr: 'tableAlias.test1 NOT ILIKE :valuenc',
            params: { valuenc: `%${str02}%` },
          },
        ])
      })

      it('should add correct query with multiple operators', () => {
        service.addAndWhereCompareToQueryBuilder(query as any, config, {
          nc: str02,
          eq: str01,
          ct: str03,
        })

        expect(query.whereArr).toEqual([
          { queryStr: 'tableAlias.id IS NOT NULL', params: undefined },
        ])
        expect(query.andWhereArr).toEqual([
          { queryStr: 'Brackets', params: null },
          {
            queryStr: 'tableAlias.test1 NOT ILIKE :valuenc',
            params: { valuenc: `%${str02}%` },
          },
          {
            queryStr: 'tableAlias.test1 = :valueeq',
            params: { valueeq: str01 },
          },
          {
            queryStr: 'tableAlias.test1 ILIKE :valuect',
            params: { valuect: `%${str03}%` },
          },
        ])
      })
    })
  })
})
