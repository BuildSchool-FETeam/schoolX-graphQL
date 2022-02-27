import { Repository } from 'typeorm'
export type MockType<T> = {
  [P in keyof T]?: jest.Mock<DynamicObject>
}

export class FakeBrackets {
  public callback: (qb: QueryBuilderMock) => void

  constructor(cb: (qb: QueryBuilderMock) => void) {
    this.callback = cb
  }
}

export class OperatorMock {
  static ILike(str: string) {
    return `ILike-${str}`
  }
}

jest.mock('typeorm', () => {
  return {
    Brackets: FakeBrackets,
    ILike: OperatorMock.ILike.bind(OperatorMock),
  }
})

export class QueryBuilderMock {
  public mockMethodCalleds: string[] = []
  public whereArr: { queryStr: string; params: DynamicObject }[] = []
  public andWhereArr: { queryStr: string; params: DynamicObject }[] = []

  select() {
    this.mockMethodCalleds.push('select')

    return this
  }

  where(
    queryStr: string | FakeBrackets | DynamicObject,
    params: DynamicObject
  ) {
    this.mockMethodCalleds.push(`where`)

    if (typeof queryStr === 'string') {
      this.whereArr.push({ queryStr, params })
    } else if (queryStr instanceof FakeBrackets) {
      this.whereArr.push({ queryStr: 'Bracket', params: null })
    } else {
      this.whereArr.push({ queryStr: 'Others', params: null })
    }

    return this
  }

  innerJoin() {
    this.mockMethodCalleds.push(`innerJoin`)

    return this
  }

  innerJoinAndSelect() {
    this.mockMethodCalleds.push(`innerJoinAndSelect`)

    return this
  }

  take() {
    this.mockMethodCalleds.push(`take`)

    return this
  }

  andWhere(
    query: FakeBrackets | string | DynamicObject,
    params: DynamicObject
  ) {
    this.mockMethodCalleds.push(`andWhere`)

    if (query instanceof FakeBrackets) {
      this.andWhereArr.push({ queryStr: 'Brackets', params: null })
      query.callback(this)
    } else if (typeof query === 'string') {
      this.andWhereArr.push({ queryStr: query, params: params })
    } else {
      this.andWhereArr.push({ queryStr: 'Others', params: null })
    }

    return this
  }

  skip() {
    this.mockMethodCalleds.push(`skip`)

    return this
  }

  orWhere() {
    this.mockMethodCalleds.push(`orWhere`)

    return this
  }

  orderBy() {
    this.mockMethodCalleds.push(`orderBy`)

    return this
  }

  async getMany() {
    return Promise.resolve([])
  }

  async getOne() {
    return Promise.resolve({})
  }

  public static countMethodCalleds(array: string[], countString: string) {
    return array.filter((str) => str === countString).length
  }
}

export const repositoryMockFactory: <T>() => MockType<Repository<T>> = jest.fn(
  () => ({
    create: jest.fn((entity) => entity),
    findOne: jest.fn((entity) => entity),
    save: jest.fn(async (entity) => Promise.resolve(entity)),
    count: jest.fn(async () => Promise.resolve(1)),
    find: jest.fn(async () => Promise.resolve([])),
    createQueryBuilder: jest.fn(() => new QueryBuilderMock()),
    remove: jest.fn(async (entity) => Promise.resolve(entity)),
  })
)
