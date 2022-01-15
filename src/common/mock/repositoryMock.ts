import { Repository } from 'typeorm'
import {} from 'ts-jest'

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<DynamicObject>
}

export class QueryBuilderMock {
  private mockMethodCalleds: string[] = []

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

  async getMany() {
    return Promise.resolve([])
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
  })
)
