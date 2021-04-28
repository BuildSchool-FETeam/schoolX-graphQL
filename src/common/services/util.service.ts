
import { InternalServerErrorException } from '@nestjs/common';
import * as _ from 'lodash';
import { OrderDirection, PaginationInput, SearchOptionInput } from 'src/graphql';
import { FindManyOptions, Like } from 'typeorm';

export abstract class UtilService {
  private readonly MAXIMUM_LIMIT = 1000;

  getTokenFromHttpHeader(headers: DynamicObject) {
    const token = _.split(headers.authorization, ' ')[1];

    if (!token) {
      throw new InternalServerErrorException('Token not found');
    }

    return token;
  }

  buildPaginationOptions<T>(pg: PaginationInput) {
    const options: FindManyOptions<T> = {};
    if (!pg) {
      return options;
    }
    const { limit, skip, order } = pg;

    limit && (options.take = limit);
    skip && (options.skip = skip);
    order && (options.order = { [order.orderBy as any]: order.direction });

    return options;
  }

  manualPagination<T>(listItems: T[], pg: PaginationInput) {
    if (!pg) {
      return listItems;
    }
    let { limit, skip, order } = pg;
    _.isNil(limit) && (limit = this.MAXIMUM_LIMIT);
    _.isNil(skip) && (skip = 0);
    _.isNil(order) &&
      (order = { orderBy: 'id', direction: OrderDirection.ASC });

    const items = _.chain(listItems)
      .slice(skip, limit + skip)
      .sortBy(order.orderBy)
      .value();

    return order.direction === OrderDirection.ASC ? items : _.reverse(items);
  }

  buildSearchOptions<T>(search: SearchOptionInput): FindManyOptions<T> {
    const findObj = {};

    if (!search) {
      return {}
    }

    _.each(search.searchFields, field => {
      findObj[field] = Like(`%${search.searchString}%`);
    })

    return {
      where: {
        ...findObj
      }
    }
  }
}
