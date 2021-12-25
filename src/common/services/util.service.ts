import { InternalServerErrorException } from '@nestjs/common'
import * as _ from 'lodash'
import { OrderDirection, PaginationInput, SearchOptionInput } from 'src/graphql'
import { FindManyOptions, ILike, SelectQueryBuilder } from 'typeorm'

export abstract class UtilService {
  private readonly MAXIMUM_LIMIT = 1000

  /**
   * The util function helping you get the token that send back via headers https/http protocol
   * @param headers contains a lot information we need for authorization
   * @returns current user token
   */
  getTokenFromHttpHeader(headers: DynamicObject) {
    const token = _.split(headers.authorization, ' ')[1]

    if (!token) {
      throw new InternalServerErrorException('Token not found')
    }

    return token
  }

  /**
   * Using the default API from typeORM for paging
   * @param pg Pagination input
   * @returns proper the many-options for typeORM work with
   */
  buildPaginationOptions<T>(pg: PaginationInput) {
    const options: FindManyOptions<T> = {}
    if (!pg) {
      return options
    }
    const { limit, skip, order } = pg

    limit && (options.take = limit)
    skip && (options.skip = skip)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    order && (options.order = { [order.orderBy as any]: order.direction })

    return options
  }

  /**
   * Because some resources cannot use the default paging API from typeORM so we use this
   * work-around pagination function, it works the same way except by using programing instead of SQL query
   * @param listItems List you want to paging
   * @param pg params for paging
   * @returns list has been paged
   */
  manuallyPagination<T>(listItems: T[], pg: PaginationInput) {
    if (!pg) {
      return listItems
    }
    let { limit, skip, order } = pg
    _.isNil(limit) && (limit = this.MAXIMUM_LIMIT)
    _.isNil(skip) && (skip = 0)
    _.isNil(order) && (order = { orderBy: 'id', direction: OrderDirection.ASC })

    const items = _.chain(listItems)
      .slice(skip, limit + skip)
      .sortBy(order.orderBy)
      .value()

    return order.direction === OrderDirection.ASC ? items : _.reverse(items)
  }

  /**
   * Using this pagination helper when the service using queryBuilder instead of findOptions
   * @param query Query builder
   * @param pagination pagination input
   */
  queryBuilderPagination<T>(
    query: SelectQueryBuilder<T>,
    pagination: PaginationInput
  ) {
    if (pagination) {
      const { limit, skip, order } = pagination

      limit && query.take(limit)
      skip && query.skip(skip)
      order && query.orderBy(order.orderBy, order.direction)
    }
  }

  buildSearchOptions<T>(search: SearchOptionInput): FindManyOptions<T> {
    const findArray: DynamicObject[] = []

    if (!search) {
      return {}
    }
    _.each(search.searchFields, (field) => {
      findArray.push({
        [field]: ILike(`%${search.searchString}%`),
      })
    })

    return {
      where: [...findArray],
    }
  }

  generateActivationCode(hours: number) {
    const code = Math.random().toString(24).slice(3, 10)
    const expiredTime = Date.now() + 1000 * 3600 * hours

    return {
      code: code.toUpperCase(),
      expiredTime,
    }
  }
}
