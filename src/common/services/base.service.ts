import { PermissionSet } from './../../permission/entities/Permission.entity';
import { CacheService } from './cache.service';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as _ from 'lodash';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { ICachedPermissionSet } from '../guards/permission.guard';
import { cacheConstant } from '../constants/cache.contant';

interface IStrictConfig {
  token: string;
  strictResourceName: keyof Omit<PermissionSet, 'id' | 'role' | 'createdBy'>;
}
export abstract class BaseService<T> {
  protected repository: Repository<T>;
  protected resourceName: string;
  protected cachingService: CacheService;

  constructor(
    repo: Repository<T>,
    resourceName?: string,
    cachingService?: CacheService,
  ) {
    this.repository = repo;
    this.resourceName = resourceName;
    this.cachingService = cachingService;
  }

  async findById(
    id: string,
    options: FindOneOptions<T> = {},
    strictConfig?: IStrictConfig,
  ) {
    if (_.size(options.relations) === 0) {
      options.relations = ['createdBy'];
    } else if (!options.relations.includes('createdBy')) {
      options.relations.push('createdBy');
    }

    const resource = await this.repository.findOne(id, options);

    if (this.cachingService && strictConfig) {
      const { adminUser, permissionSet } = await this.getAdminUserCredential(
        strictConfig,
      );
      if (
        this.isStrictPermission(permissionSet[strictConfig.strictResourceName])
      ) {
        if (_.isNil((resource as any).createdBy)) {
          throw new ForbiddenException(
            "You don't have permission to do this action on resource",
          );
        }

        if ((resource as any).createdBy.id !== adminUser.id) {
          throw new ForbiddenException(
            "You don't have permission to do this action on resource",
          );
        }
      }
    }

    if (!resource) {
      throw new NotFoundException(
        `Resource ${this.resourceName || ''} with id: ${id} not found`,
      );
    }
    return resource;
  }

  async findWithOptions(
    options?: FindManyOptions<T>,
    strictConfig?: IStrictConfig,
  ) {
    let finalOptions: FindManyOptions<T> = options;

    if (this.cachingService && strictConfig) {
      const { adminUser, permissionSet } = await this.getAdminUserCredential(
        strictConfig,
      );

      if (
        this.isStrictPermission(permissionSet[strictConfig.strictResourceName])
      ) {
        finalOptions = _.assign(options.where, {
          createdBy: adminUser,
        }) as FindManyOptions<T>;
      }
    }

    const resource = await this.repository.find(finalOptions);
    if (!resource) {
      throw new NotFoundException(
        `Resources ${this.resourceName || ''} not found`,
      );
    }
    return resource;
  }

  async deleteOneById(id: string, strictConfig?: IStrictConfig) {
    if (strictConfig && this.cachingService) {
      await this.findById(id, {}, strictConfig);
    }

    const existedItem = await this.repository.findOne(id);
    if (!existedItem) {
      throw new NotFoundException(
        `Resource ${this.resourceName || ''} with id: ${id} not found`,
      );
    }
    return this.repository.delete(id);
  }

  getTokenFromHttpHeader(headers: DynamicObject) {
    const token = _.split(headers.authorization, ' ')[1];

    if (!token) {
      throw new InternalServerErrorException('Token not found');
    }

    return token;
  }

  private isStrictPermission(permissionAsString: string) {
    return _.includes(permissionAsString.split('|'), 'S');
  }

  private async getAdminUserCredential(strictConfig: IStrictConfig) {
    return await this.cachingService.getValue<ICachedPermissionSet>(
      `${cacheConstant.PERMISSION}-${strictConfig.token}`,
    );
  }
}
