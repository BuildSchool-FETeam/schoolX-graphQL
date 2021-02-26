import { NotFoundException } from '@nestjs/common';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';

export abstract class BaseService<T> {
  protected repository: Repository<T>

  constructor(repo: Repository<T>) {
    this.repository = repo
  }

  findById (id: string, options?: FindOneOptions<T>) {
    return this.repository.findOne(id, options)
  }

  findWithOptions (options?: FindManyOptions<T>) {
    return this.repository.find(options)
  }

  async deleteOneById (id: string) {
    const existedItem = await this.repository.findOne(id)
    if (!existedItem) {
      throw new NotFoundException(`Resource with id: ${id} not found`)
    }
    return this.repository.delete(id);
  }
}