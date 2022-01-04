import { each } from 'lodash'
import { PaginationInput, SearchOptionInput } from 'src/graphql'
import { FindManyOptions, ILike } from 'typeorm'

export const baseServiceMock = {
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
  },

  buildSearchOptions<T>(search: SearchOptionInput): FindManyOptions<T> {
    const findArray: DynamicObject[] = []

    if (!search) {
      return {}
    }
    each(search.searchFields, (field) => {
      findArray.push({
        [field]: ILike(`%${search.searchString}%`),
      })
    })

    return {
      where: [...findArray],
    }
  },
}
