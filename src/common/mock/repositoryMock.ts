import { Repository } from 'typeorm'
import {} from 'ts-jest'

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<DynamicObject>
}

export const repositoryMockFactory: <T>() => MockType<Repository<T>> = jest.fn(
  () => ({
    create: jest.fn((entity) => entity),
    findOne: jest.fn((entity) => entity),
    save: jest.fn(async () => Promise.resolve()),
  })
)
