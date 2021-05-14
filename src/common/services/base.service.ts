import { PermissionSet } from './../../permission/entities/Permission.entity';
import { CacheService } from './cache.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import * as _ from 'lodash';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { ICachedPermissionSet } from '../guards/permission.guard';
import { cacheConstant } from '../constants/cache.contant';
import { UtilService } from './util.service';

export interface IStrictConfig {
  token: string;
  strictResourceName: keyof Omit<PermissionSet, 'id' | 'role' | 'createdBy'>;
}
export abstract class BaseService<T> extends UtilService {
  protected repository: Repository<T>;
  protected resourceName: string;
  protected cachingService: CacheService;

  constructor(
    repo: Repository<T>,
    resourceName?: string,
    cachingService?: CacheService,
  ) {
    super();
    this.repository = repo;
    this.resourceName = resourceName;
    this.cachingService = cachingService;
  }

  async findById(
    id: string,
    options: FindOneOptions<T> = {},
    strictConfig?: IStrictConfig,
  ) {
    if (strictConfig) {
      if (_.size(options.relations) === 0) {
        options.relations = ['createdBy'];
      } else if (!options.relations.includes('createdBy')) {
        options.relations.push('createdBy');
      }
    }

    const resource = await this.repository.findOne(id, options);

    if (strictConfig) {
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
    if (strictConfig) {
      const { adminUser, permissionSet } = await this.getAdminUserCredential(
        strictConfig,
      );

      if (
        this.isStrictPermission(permissionSet[strictConfig.strictResourceName])
      ) {
        if (_.isArray(options.where)) {
          const strictWhereOptions = _.map(options.where, (whereOpt) => {
            const whereOptions = _.assign(whereOpt, {
              createdBy: adminUser,
            }) as FindManyOptions<T>;

            return whereOptions;
          });
          options = {
            ...options,
            where: strictWhereOptions,
          };
        } else {
          const whereOptions = _.assign(options.where, {
            createdBy: adminUser,
          }) as FindManyOptions<T>;

          options = {
            ...options,
            where: whereOptions,
            cache: true,
          };
        }
      }
    }

    const resource = await this.repository.find(options);
    if (!resource) {
      throw new NotFoundException(
        `Resources ${this.resourceName || ''} not found`,
      );
    }
    return resource;
  }

  async deleteOneById(id: string, strictConfig?: IStrictConfig) {
    if (strictConfig) {
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

  private isStrictPermission(permissionAsString: string) {
    return _.includes(permissionAsString.split('|'), 'S');
  }

  protected async getAdminUserCredential(strictConfig: IStrictConfig) {
    return await this.cachingService.getValue<ICachedPermissionSet>(
      `${cacheConstant.PERMISSION}-${strictConfig.token}`,
    );
  }
}
