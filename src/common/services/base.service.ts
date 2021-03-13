import { NotFoundException } from '@nestjs/common';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';

export abstract class BaseService<T> {
  protected repository: Repository<T>;
  protected resourceName: string;

  constructor(repo: Repository<T>, resourceName?: string) {
    this.repository = repo;
    this.resourceName = resourceName;
  }

  async findById(id: string, options?: FindOneOptions<T>) {
    const resource = await this.repository.findOne(id, options);
    if (!resource) {
      throw new NotFoundException(
        `Resource ${this.resourceName || ''} with id: ${id} not found`,
      );
    }
    return resource;
  }

  async findWithOptions(options?: FindManyOptions<T>) {
    const resource = await this.repository.find(options);
    if (!resource) {
      throw new NotFoundException(
        `Resources ${this.resourceName || ''} not found`,
      );
    }
    return resource;
  }

  async deleteOneById(id: string) {
    const existedItem = await this.repository.findOne(id);
    if (!existedItem) {
      throw new NotFoundException(
        `Resource ${this.resourceName || ''} with id: ${id} not found`,
      );
    }
    return this.repository.delete(id);
  }
}
