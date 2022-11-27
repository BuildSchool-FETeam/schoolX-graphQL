import * as _ from 'lodash'
import { each } from 'lodash'
import { OrderDirection, PaginationInput, SearchOptionInput } from 'src/graphql'
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
} from 'typeorm'

export const baseServiceMock = {
  buildPaginationOptions<T>(pg: PaginationInput) {
    const options: FindManyOptions<T> = {}
    if (!pg) {
      return options
    }
    const { limit, skip, order } = pg

    limit && (options.take = limit)
    skip && (options.skip = skip)
    order &&
      (options.order = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [order.orderBy as any]: order.direction,
      } as FindOptionsOrder<T>)

    return options
  },

  buildSearchOptions<T>(search: SearchOptionInput): FindManyOptions<T> {
    const findArray: FindOptionsWhere<T>[] = []

    if (!search) {
      return {}
    }
    each(search.searchFields, (field) => {
      findArray.push({
        [field]: ILike(`%${search.searchString}%`),
      } as FindOptionsWhere<T>)
    })

    return {
      where: [...findArray],
    }
  },

  manuallyPagination<T>(listItems: T[], pg?: PaginationInput) {
    if (!pg) {
      return listItems
    }
    let { limit, skip, order } = pg
    _.isNil(limit) && (limit = 10)
    _.isNil(skip) && (skip = 0)
    _.isNil(order) && (order = { orderBy: 'id', direction: OrderDirection.ASC })

    const items = _.chain(listItems)
      .slice(skip, limit + skip)
      .sortBy(order.orderBy)
      .value()

    return order.direction === OrderDirection.ASC ? items : _.reverse(items)
  },

  async findById() {
    return Promise.resolve({})
  },

  async findWithOptions() {
    return Promise.resolve([])
  },
}
