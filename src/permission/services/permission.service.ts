import { PermissionSetInput } from 'src/graphql';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from 'src/common/enums/resource.enum';
import * as _ from 'lodash';
import { BaseService, IStrictConfig } from 'src/common/services/base.service';
import { TokenService } from 'src/common/services/token.service';
import { CacheService } from 'src/common/services/cache.service';
import { PermissionSet } from '../entities/Permission.entity';
import { RoleService } from './role.service';

@Injectable()
export class PermissionService extends BaseService<PermissionSet> {
  constructor(
    @InjectRepository(PermissionSet)
    private permissionRepo: Repository<PermissionSet>,
    private roleService: RoleService,
    private tokenService: TokenService,
    public cachedService: CacheService,
  ) {
    super(permissionRepo, 'Permission', cachedService);
  }

  createAdminPermission() {
    const fullPerm = 'CRUD'.split('').join('|');
    const permissionSet = this.permissionRepo.create({
      course: fullPerm,
      blog: fullPerm,
      permission: fullPerm,
      user: fullPerm,
      instructor: fullPerm,
      notification: fullPerm,
    });

    return permissionSet;
  }

  async getClientUserPermission() {
    const clientPerm = 'R';
    const clientPermissionName = 'client_permission';

    const permissionSet = this.permissionRepo.create({
      course: clientPerm,
      blog: 'C|R|U|D|S',
      instructor: clientPerm,
      user: '',
      permission: '',
      notification: '',
    });

    const existedRole = await this.roleService.findRoleByName(
      clientPermissionName,
    );
    if (existedRole) {
      return existedRole;
    }

    const role = await this.roleService.createRole(clientPermissionName);

    permissionSet.role = role;
    await this.permissionRepo.save(permissionSet);

    return role;
  }

  async savePermissionSet(permissionSet: PermissionSet) {
    return this.permissionRepo.save(permissionSet);
  }

  async createPermission(input: PermissionSetInput, token: string) {
    const inputWithoutName = _.omit(input, 'roleName');
    const role = await this.roleService.createRole(input.roleName);
    const adminUser = await this.tokenService.getAdminUserByToken(token);

    const perSet = this.permissionRepo.create({
      ...inputWithoutName,
      createdBy: adminUser,
    });

    perSet.role = role;
    await this.permissionRepo.save(perSet);

    return {
      name: role.name,
      permissionSet: perSet,
    };
  }

  async updatePermission(
    id: string,
    input: PermissionSetInput,
    strictConfig: IStrictConfig,
  ) {
    const permissionSet = await this.findById(
      id,
      {
        relations: ['role'],
      },
      strictConfig,
    );

    if (!permissionSet) {
      throw new NotFoundException(`Resource with id "${id}" not found`);
    }
    await this.roleService.updateRole(permissionSet.role.name, input.roleName);
    _.forOwn(_.omit(input, 'roleName'), (value, key: Resource) => {
      permissionSet[key] = value;
    });

    const savedData = await this.permissionRepo.save(permissionSet);

    return {
      name: input.roleName,
      permissionSet: savedData,
    };
  }

  async deletePermission(id: string, token: string) {
    const permission = await this.findById(id, { relations: ['role'] });
    await this.deleteOneById(id, {
      token,
      strictResourceName: 'permission',
    });

    await this.roleService.deleteRoleByName(permission.role.name);

    return true;
  }

  async getPermissionByRole(roleName: string) {
    return this.permissionRepo
      .createQueryBuilder('perm')
      .innerJoinAndSelect('perm.role', 'role', 'role.name = :name', {
        name: roleName,
      })
      .getOne();
  }
}
