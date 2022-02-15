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

  select() {
    this.mockMethodCalleds.push('select')

    return this
  }

  where() {
    this.mockMethodCalleds.push(`where`)

    return this
  }

  innerJoin() {
    this.mockMethodCalleds.push(`innerJoin`)

    return this
  }

  innerJoinAndSelect() {
    this.mockMethodCalleds.push(`innerJoinAndSelect`)
  }

  take() {
    this.mockMethodCalleds.push(`take`)

    return this
  }

  andWhere(fakeBrackets?: FakeBrackets) {
    this.mockMethodCalleds.push(`andWhere`)

    if (fakeBrackets) {
      fakeBrackets.callback(this)
    }
  }

  skip() {
    this.mockMethodCalleds.push(`skip`)

    return this
  }

  orWhere() {
    this.mockMethodCalleds.push(`orWhere`)
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
